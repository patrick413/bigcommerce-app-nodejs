import { Modal, Link, Text, Small } from '@bigcommerce/big-design';
import { useState } from 'react';
import { useRouter } from 'next/router';


function ModalInfo({ data, id, credentials }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const onEdit = () => {
    (setIsOpen(false))
              router.push({
              pathname: `/collection/${data.id}`,
              query: { collection: id, url:credentials.url, apiKey: credentials.apiKey },
					})
  }
  return (
    <>
      <Link onClick={() => setIsOpen(true)}>{data.name}</Link>
      <Modal
        actions={[
          {
            text: 'Edit',
            onClick: () => onEdit(),
          },
          {
            text: 'Close',
            variant: 'subtle',
            onClick: () => setIsOpen(false),
          }
        ]}
        closeOnClickOutside={true}
        closeOnEscKey={true}
        header={data.name}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Text margin='none'>Name:</Text>
        <Small margin='none'>{data.name}</Small>
        <Text margin='none' marginTop="medium">SKU:</Text>
        <Small margin='none'>{data.sku}</Small>
        <Text margin='none' marginTop="medium">Parent SKU:</Text>
        <Small margin='none'>{data.parentSku}</Small>
        <Text margin='none' marginTop="medium">Product URL:</Text>
        <Small margin='none'>{data.productUrl}</Small>
        <Text margin='none' marginTop="medium">Variants:</Text>
        <Small margin='none'>{data.variants?.join(' | ')}</Small>
        <Text margin='none' marginTop="medium">Categories:</Text>
        <Small margin='none'>{data.categories?.join(' | ')}</Small>
        <Text margin='none' marginTop="medium">Categories Level 0:</Text>
        <Small margin='none'>{data["categories.lvl0"]?.join(' | ')}</Small>
        <Text margin='none' marginTop="medium">Categories Level 1:</Text>
        <Small margin='none'>{data["categories.lvl1"]?.join(' | ')}</Small>
        <Text margin='none' marginTop="medium">Categories Level 2:</Text>
        <Small margin='none'>{data["categories.lvl2"]?.join(' | ')}</Small>
        <Text margin='none' marginTop="medium">Description:</Text>
        <Small margin='none'>{data.description}</Small>
        <Text margin='none' marginTop="medium">Image:</Text>
        {data.image?.url?.length == 0 ? <Text margin='none' marginTop="medium">No Image Available</Text> : <img src={data.image?.url} alt={data.image?.alt} />}
      </Modal>
    </>
  );
}

export default ModalInfo;
