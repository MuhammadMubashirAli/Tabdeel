
'use client';

import { useParams } from 'next/navigation';
import { ItemDetailDialog } from '@/app/components/item-detail-dialog';
import { items as allItems } from '@/lib/data';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Item } from '@/lib/types';


export default function ItemPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [item, setItem] = useState<Item | null>(null);

    useEffect(() => {
        if (id) {
            const foundItem = allItems.find(i => i.id === id);
            if (foundItem) {
                setItem(foundItem);
            } else {
                // Handle item not found, maybe redirect
                router.push('/explore');
            }
        }
    }, [id, router]);

    if (!item) {
        // You can show a loading spinner here
        return <div>Loading...</div>;
    }

    return (
         <ItemDetailDialog 
            item={item} 
            open={true} 
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                   router.back();
                }
            }}
        />
    );
}
