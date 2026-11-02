import { useState } from 'react';
import { MenuIcon, PlusIcon, SearchIcon, TrashIcon } from '../components/icons';
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  IconButton,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../components/ui';
import { Demo, Row } from './shell';

export function CoreDemos() {
  const [email, setEmail] = useState('ornek@');
  const [city, setCity] = useState('');
  const emailInvalid = !/^\S+@\S+\.\S+$/.test(email);

  return (
    <>
      <Demo title="Button" description="Varyantlar, boyutlar, yükleme durumu, ikonlu ve link olarak kullanım.">
        <Row label="Varyant">
          <Button>Varsayılan</Button>
          <Button variant="secondary">İkincil</Button>
          <Button variant="outline">Çerçeveli</Button>
          <Button variant="ghost">Hayalet</Button>
          <Button variant="link">Bağlantı</Button>
          <Button variant="destructive">Sil</Button>
        </Row>
        <Row label="Boyut">
          <Button size="xs">XS</Button>
          <Button size="sm">Küçük</Button>
          <Button size="md">Orta</Button>
          <Button size="lg">Büyük</Button>
        </Row>
        <Row label="Durum">
          <Button>
            <PlusIcon /> Yeni ürün
          </Button>
          <Button loading>Kaydediliyor</Button>
          <Button disabled>Pasif</Button>
          <Button asChild variant="outline">
            <a href="#button">Anchor olarak</a>
          </Button>
        </Row>
        <Row label="IconButton">
          <IconButton aria-label="Menü" size="xs">
            <MenuIcon />
          </IconButton>
          <IconButton aria-label="Ara" size="sm" variant="outline">
            <SearchIcon />
          </IconButton>
          <IconButton aria-label="Ekle" variant="default">
            <PlusIcon />
          </IconButton>
          <IconButton aria-label="Sil" size="lg" variant="destructive">
            <TrashIcon />
          </IconButton>
        </Row>
      </Demo>

      <Demo title="Input, Label ve Field" description="Field; etiket, açıklama ve hata mesajını input'a aria öznitelikleriyle bağlar.">
        <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel>Ad Soyad</FieldLabel>
            <Input placeholder="Ayşe Yılmaz" />
          </Field>
          <Field invalid={emailInvalid} required>
            <FieldLabel>E-posta</FieldLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <FieldDescription>Sipariş bildirimleri bu adrese gelir.</FieldDescription>
            <FieldError>Geçerli bir e-posta adresi girin.</FieldError>
          </Field>
          <Field>
            <FieldLabel>Şifre</FieldLabel>
            <Input type="password" defaultValue="gizli-sifre" />
          </Field>
          <Field disabled>
            <FieldLabel>Pasif alan</FieldLabel>
            <Input defaultValue="Düzenlenemez" />
          </Field>
        </div>
        <Row label="Boyut">
          <Input size="sm" placeholder="Küçük" className="w-40" />
          <Input size="md" placeholder="Orta" className="w-40" />
          <Input size="lg" placeholder="Büyük" className="w-40" />
        </Row>
        <Row label="Label">
          <Label htmlFor="free">Serbest etiket</Label>
          <Input id="free" className="w-48" />
          <Label required>Zorunlu</Label>
        </Row>
      </Demo>

      <Demo title="Badge">
        <Row>
          <Badge>Yeni</Badge>
          <Badge variant="secondary">Taslak</Badge>
          <Badge variant="outline">Ofis</Badge>
          <Badge variant="success">Aktif</Badge>
          <Badge variant="warning">Beklemede</Badge>
          <Badge variant="destructive">İptal</Badge>
          <Badge variant="info">Bilgi</Badge>
          <Badge size="sm" variant="outline">
            <span className="size-1.5 rounded-full bg-success" /> Çevrimiçi
          </Badge>
        </Row>
      </Demo>

      <Demo title="Card">
        <div className="grid max-w-4xl gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Teslimat adresi</CardTitle>
              <CardDescription>Siparişleriniz bu adrese gönderilir.</CardDescription>
              <CardAction>
                <Button variant="ghost" size="sm">
                  Düzenle
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="text-sm">Bağdat Cad. No: 12, Kadıköy / İstanbul</CardContent>
            <CardFooter className="justify-end border-t">
              <Button size="sm">Kaydet</Button>
            </CardFooter>
          </Card>
          <Card variant="muted" size="sm">
            <CardHeader>
              <CardTitle>Muted, küçük</CardTitle>
              <CardDescription>İkincil bilgiler için sade kart.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">Kart içeriği</CardContent>
          </Card>
        </div>
      </Demo>

      <Demo title="Select" description="Klavye: ok tuşları, Home/End, harf yazarak arama, Enter ile seçim, Escape ile kapatma.">
        <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel>Şehir</FieldLabel>
            <Select value={city} onValueChange={setCity} name="city">
              <SelectTrigger>
                <SelectValue placeholder="Şehir seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Marmara</SelectLabel>
                  <SelectItem value="istanbul">İstanbul</SelectItem>
                  <SelectItem value="bursa">Bursa</SelectItem>
                  <SelectItem value="kocaeli">Kocaeli</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>İç Anadolu</SelectLabel>
                  <SelectItem value="ankara">Ankara</SelectItem>
                  <SelectItem value="konya" disabled>
                    Konya (kapalı)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>Seçilen: {city || '—'}</FieldDescription>
          </Field>
          <Field invalid>
            <FieldLabel>Hatalı select</FieldLabel>
            <Select>
              <SelectTrigger size="sm">
                <SelectValue placeholder="Seçim yapın" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Seçenek A</SelectItem>
                <SelectItem value="b">Seçenek B</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>Bu alan zorunludur.</FieldError>
          </Field>
        </div>
      </Demo>

      <Demo title="Dialog" description="Odak tuzağı, Escape, dış tıklama, kaydırma kilidi; içinde select de çalışır.">
        <Row>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Adres ekle</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni adres</DialogTitle>
                <DialogDescription>Teslimat için kullanılacak adres bilgileri.</DialogDescription>
              </DialogHeader>
              <DialogBody className="flex flex-col gap-4">
                <Field>
                  <FieldLabel>Adres başlığı</FieldLabel>
                  <Input placeholder="Ev, iş..." data-autofocus />
                </Field>
                <Field>
                  <FieldLabel>Şehir</FieldLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="istanbul">İstanbul</SelectItem>
                      <SelectItem value="izmir">İzmir</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Vazgeç</Button>
                </DialogClose>
                <Button>Kaydet</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">Uzun içerik</Button>
            </DialogTrigger>
            <DialogContent size="lg">
              <DialogHeader>
                <DialogTitle>Mesafeli satış sözleşmesi</DialogTitle>
              </DialogHeader>
              <DialogBody className="space-y-3 text-sm text-muted-foreground">
                {Array.from({ length: 30 }, (_, i) => (
                  <p key={i}>Madde {i + 1}. Bu metin kaydırılabilir gövdeyi göstermek içindir.</p>
                ))}
              </DialogBody>
            </DialogContent>
          </Dialog>
        </Row>
      </Demo>
    </>
  );
}
