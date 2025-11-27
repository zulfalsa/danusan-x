import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Product {
    product_id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    description: string;
    image: string | null;
}

export default function SellerProducts({ products }: { products: Product[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form Hook Inertia
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        image: null as File | null,
        _method: 'POST' 
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
            setEditingProduct(null);
            setData('_method', 'POST');
        }
    }, [isOpen]);

    // Setup form untuk mode Edit
    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setData({
            name: product.name,
            price: product.price.toString(),
            stock: product.stock.toString(),
            category: product.category || '',
            description: product.description || '',
            image: null,
            _method: 'PUT' 
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingProduct) {
            // Mode Update
            post(`/seller/products/${editingProduct.product_id}`), {
                onSuccess: () => setIsOpen(false),
                preserveScroll: true,
            };
        } else {
            // Mode Create
            post('/seller/products'), {
                onSuccess: () => setIsOpen(false),
                preserveScroll: true,
            };
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(`/seller/products/${id}`), {
                preserveScroll: true,
            };
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Produk Saya', href: '#' }]}>
            <Head title="Manajemen Produk" />
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Produk Saya</h1>
                        <p className="text-gray-500 text-sm">Kelola katalog barang dagangan Anda</p>
                    </div>
                    
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4"/> Tambah Produk</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div>
                                    <Label>Nama Produk</Label>
                                    <Input 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                        placeholder="Contoh: Risol Mayo"
                                        required 
                                    />
                                    {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Harga (Rp)</Label>
                                        <Input 
                                            type="number" 
                                            value={data.price} 
                                            onChange={e => setData('price', e.target.value)} 
                                            placeholder="5000"
                                            required 
                                        />
                                        {errors.price && <span className="text-red-500 text-xs">{errors.price}</span>}
                                    </div>
                                    <div>
                                        <Label>Stok</Label>
                                        <Input 
                                            type="number" 
                                            value={data.stock} 
                                            onChange={e => setData('stock', e.target.value)} 
                                            placeholder="10"
                                            required 
                                        />
                                        {errors.stock && <span className="text-red-500 text-xs">{errors.stock}</span>}
                                    </div>
                                </div>

                                <div>
                                    <Label>Kategori (Opsional)</Label>
                                    <Input 
                                        value={data.category} 
                                        onChange={e => setData('category', e.target.value)} 
                                        placeholder="Makanan, Minuman, Merchandise..."
                                    />
                                </div>

                                <div>
                                    <Label>Deskripsi</Label>
                                    <Textarea 
                                        value={data.description} 
                                        onChange={e => setData('description', e.target.value)} 
                                        placeholder="Jelaskan detail produk..."
                                    />
                                </div>

                                <div>
                                    <Label>Gambar Produk {editingProduct && '(Biarkan kosong jika tidak diganti)'}</Label>
                                    <Input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('image', e.currentTarget.files ? e.currentTarget.files[0] : null)} 
                                    />
                                    {errors.image && <span className="text-red-500 text-xs">{errors.image}</span>}
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? 'Menyimpan...' : (editingProduct ? 'Update Produk' : 'Simpan Produk')}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-gray-50 text-gray-400">
                        <Package className="h-16 w-16 mb-4" />
                        <p className="text-lg font-medium">Belum ada produk</p>
                        <p className="text-sm">Mulai tambahkan produk untuk berjualan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <Card key={product.product_id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                                <div className="h-48 bg-gray-100 relative group">
                                    {product.image ? (
                                        <img src={`/storage/${product.image}`} className="w-full h-full object-cover" alt={product.name} />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 bg-gray-200">
                                            No Image
                                        </div>
                                    )}
                                    {/* Action Buttons overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            onClick={() => handleEditClick(product)}
                                        >
                                            <Pencil className="h-4 w-4 mr-1" /> Edit
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => handleDelete(product.product_id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" /> Hapus
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-4 flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight mb-1">{product.name}</h3>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
                                        </div>
                                        <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded text-sm">
                                            Rp {product.price.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>
                                    <div className="text-sm font-medium pt-2 border-t flex justify-between">
                                        <span>Stok: {product.stock}</span>
                                        <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                            {product.stock > 0 ? 'Tersedia' : 'Habis'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}