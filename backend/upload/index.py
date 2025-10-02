'''
Business: API для загрузки видеофайлов в Yandex Cloud Storage
Args: event - dict с httpMethod, body (base64 encoded file)
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с URL загруженного файла
'''

import json
import os
import base64
import uuid
from typing import Dict, Any
import boto3
from botocore.client import Config

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        file_content = body_data.get('file')
        file_name = body_data.get('fileName', 'video.mp4')
        
        if not file_content:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Файл не предоставлен'}),
                'isBase64Encoded': False
            }
        
        file_bytes = base64.b64decode(file_content.split(',')[1] if ',' in file_content else file_content)
        
        access_key = os.environ.get('YANDEX_CLOUD_STORAGE_KEY_ID')
        secret_key = os.environ.get('YANDEX_CLOUD_STORAGE_SECRET_KEY')
        bucket_name = os.environ.get('YANDEX_CLOUD_STORAGE_BUCKET')
        
        s3_client = boto3.client(
            's3',
            endpoint_url='https://storage.yandexcloud.net',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            config=Config(signature_version='s3v4'),
            region_name='ru-central1'
        )
        
        unique_filename = f"videos/{uuid.uuid4()}-{file_name}"
        
        s3_client.put_object(
            Bucket=bucket_name,
            Key=unique_filename,
            Body=file_bytes,
            ContentType='video/mp4'
        )
        
        file_url = f"https://storage.yandexcloud.net/{bucket_name}/{unique_filename}"
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'url': file_url}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
