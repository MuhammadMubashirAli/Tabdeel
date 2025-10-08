
'use client';

import { useParams } from 'next/navigation';
import { ItemDetailDialog } from '@/app/components/item-detail-dialog';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Item } from '@/lib/types';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';


export default function ItemPage() {
    const params = useParams();
    const router = useRouter();
    const firestore = useFirestore();
    const { id } = params;

    const itemRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'items', id as string);
    }, [firestore, id]);

    const { data: item, isLoading } = useDoc<Item>(itemRef);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (!item && !isLoading) {
        // Handle item not found, maybe redirect
        router.push('/explore');
        return null;
    }

    return (
         <ItemDetailDialog 
            item={item!} 
            open={true} 
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                   router.back();
                }
            }}
        />
    );
}
