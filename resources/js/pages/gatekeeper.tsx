import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { LockKeyhole } from 'lucide-react';

export default function Gatekeeper() {
    const { data, setData, post, processing, errors } = useForm({
        secret_password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(window.route('gate.store'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Head title="Restricted Access" />
            
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                        <LockKeyhole className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Akses Terbatas</CardTitle>
                    <CardDescription>
                        Halaman ini khusus untuk panitia/seller terdaftar. 
                        Masukkan kode akses untuk melanjutkan ke Login/Register.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="secret">Kode Akses</Label>
                            <Input 
                                id="secret"
                                type="password" 
                                placeholder="Masukkan kode rahasia..." 
                                value={data.secret_password}
                                onChange={e => setData('secret_password', e.target.value)}
                                className="text-center tracking-widest"
                                autoFocus
                            />
                            {errors.secret_password && (
                                <p className="text-sm text-red-500 font-medium text-center">
                                    {errors.secret_password}
                                </p>
                            )}
                        </div>
                        
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? 'Memeriksa...' : 'Buka Akses'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}