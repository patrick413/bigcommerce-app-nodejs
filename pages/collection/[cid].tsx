import { useRouter } from 'next/router';
import ErrorMessage from '../../components/error';
import Form from '../../components/form';
import Loading from '../../components/loading';
import {useCollectionList } from '../../lib/hooks';
import { FormData } from '../../types';
import { collectionUpdate } from '@pages/api/collections';
import { useState } from 'react';

const ProductInfo = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter();
    const { cid, collection, url, apiKey } = router.query;
    const { error, isLoading, list = [], mutateList } = useCollectionList(url, apiKey, collection, cid);
    const formData =  list[0] ;
    
    const handleCancel = () => router.push('/collection');

    const handleSubmit = async (data: FormData) => {
        try {
            setIsSubmitting(true)
            const response = await collectionUpdate(collection, cid.toString(), 'PATCH', data)
            setIsSubmitting(false)
            mutateList();
        } catch (error) { 
    }
    };

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <Form formData={formData} onCancel={handleCancel} onSubmit={handleSubmit} isLoading={isSubmitting} />
    );
};

export default ProductInfo;
