import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Video {
  id: string;
  title: string;
  file_url: string;
  teacher_name: string;
  created_at: string;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<'home' | 'greetings'>('home');
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    file_url: '',
    teacher_name: ''
  });
  const { toast } = useToast();

  const API_URL = 'https://functions.poehali.dev/697c4fb0-53e9-48c4-8e3c-562e77967c89';

  useEffect(() => {
    if (activeTab === 'greetings') {
      fetchVideos();
    }
  }, [activeTab]);

  const fetchVideos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить видео',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      toast({
        title: 'Успешно!',
        description: `Ваше поздравление загружено. ID: ${data.id}`
      });

      setFormData({ title: '', file_url: '', teacher_name: '' });
      setActiveTab('greetings');
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить видео',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyShareLink = (videoId: string) => {
    const link = `${window.location.origin}/video/${videoId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Скопировано!',
      description: 'Ссылка скопирована в буфер обмена'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="GraduationCap" size={32} className="text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                День Учителя
              </h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('home')}
                className="gap-2"
              >
                <Icon name="Home" size={18} />
                Главная
              </Button>
              <Button
                variant={activeTab === 'greetings' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('greetings')}
                className="gap-2"
              >
                <Icon name="Video" size={18} />
                Поздравления
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {activeTab === 'home' && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Поздравьте своих учителей!
              </h2>
              <p className="text-xl text-muted-foreground">
                Загрузите видео-поздравление и поделитесь им по уникальной ссылке
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon name="Upload" size={24} className="text-primary" />
                  </div>
                  <CardTitle>Загрузите видео</CardTitle>
                  <CardDescription>Добавьте ссылку на ваше видео-поздравление</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-2 border-secondary/20 hover:border-secondary/40 transition-all hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon name="Share2" size={24} className="text-secondary" />
                  </div>
                  <CardTitle>Поделитесь</CardTitle>
                  <CardDescription>Получите уникальную ссылку без регистрации</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Heart" size={24} className="text-primary" />
                  Создать поздравление
                </CardTitle>
                <CardDescription>Заполните форму ниже, чтобы добавить своё видео</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Название поздравления</Label>
                    <Input
                      id="title"
                      placeholder="Например: Поздравление классному руководителю"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher">Имя учителя</Label>
                    <Input
                      id="teacher"
                      placeholder="Например: Иванова Мария Александровна"
                      value={formData.teacher_name}
                      onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video">Ссылка на видео</Label>
                    <Textarea
                      id="video"
                      placeholder="Вставьте ссылку на видео (YouTube, Google Drive, и т.д.)"
                      value={formData.file_url}
                      onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                      required
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Icon name="Loader2" size={18} className="animate-spin mr-2" />
                        Загрузка...
                      </>
                    ) : (
                      <>
                        <Icon name="Send" size={18} className="mr-2" />
                        Отправить поздравление
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-12 text-center">
              <img 
                src="/img/db12250d-1e73-4a33-933a-0b965a96bed4.jpg" 
                alt="День учителя" 
                className="max-w-md mx-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'greetings' && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold mb-4">Все поздравления</h2>
              <p className="text-xl text-muted-foreground">
                {videos.length} поздравлений от благодарных учеников
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card 
                  key={video.id} 
                  className="bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all hover:scale-105"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <Icon name="Video" size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">{video.title}</CardTitle>
                      </div>
                    </div>
                    {video.teacher_name && (
                      <CardDescription className="flex items-center gap-2">
                        <Icon name="User" size={14} />
                        {video.teacher_name}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Ссылка для просмотра:</p>
                      <code className="text-xs break-all">/video/{video.id}</code>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => copyShareLink(video.id)}
                      >
                        <Icon name="Copy" size={14} className="mr-2" />
                        Копировать
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(video.file_url, '_blank')}
                      >
                        <Icon name="Play" size={14} className="mr-2" />
                        Смотреть
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {videos.length === 0 && (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Icon name="Video" size={64} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-xl text-muted-foreground mb-4">Пока нет поздравлений</p>
                  <Button onClick={() => setActiveTab('home')}>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Создать первое поздравление
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <footer className="bg-white/80 backdrop-blur-sm border-t border-orange-100 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <Icon name="Heart" size={18} className="text-primary" />
              Сделано с любовью ко Дню учителя
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
