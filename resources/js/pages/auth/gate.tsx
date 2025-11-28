import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';

export default function Gate() {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Post ke route gate.unlock yang sudah kita definisikan
        post('/secret-gate');
    };

    return (
        <AuthSimpleLayout>
            <Head title="Restricted Area" />
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    {/* Icon Gembok atau Warning bisa ditambahkan disini */}
                    <h1 className="text-2xl font-bold text-red-600">Restricted Area</h1>
                    <p className="text-sm text-muted-foreground">
                        Halaman Login & Register dilindungi. Masukkan kode akses khusus untuk melanjutkan.
                    </p>
                </div>
                <div className="grid gap-6">
                    <form onSubmit={submit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password">Secret Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    placeholder="Masukkan kode rahasia..."
                                    autoFocus
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500 font-medium">{errors.password}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full" disabled={processing}>
                                Buka Gerbang
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthSimpleLayout>
    );
}