import { Table, Panel, Tooltip, Small, Link as StyledLink, Button } from '@bigcommerce/big-design';
import { EditIcon } from '@bigcommerce/big-design-icons';
import { useState, useEffect, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { TableItem } from '../types';
import ModalInfo from "@components/modals/detailModal";

const CollectionTable = ({ list, isLoading, activeCollection, search, credentials }) => {
    const columnDefinition = {
        ss_dev_variants : [
            {
                header: "Name",
                hash: "name",
                render: ({...rowData}) => renderName(rowData),
            },
            {
                header: "SKU",
                hash: "sku",
                render: ({ sku }) => renderSKU(sku),
            },
            {
                header: "Child SKU",
                hash: "childSku",
                render: ({ childSku }) => renderSKU(childSku),
            },
            {
                header: "Parent SKU",
                hash: "sku",
                render: ({ parentSku }) => renderSKU(parentSku),
            },
            {
                header: "Product URL",
                hash: "productUrl",
                render: ({ productUrl }) => renderURL(productUrl),
            },
            {
                header: "Categories",
                hash: "categories",
                render: ({ categories }) => renderCategories(categories),
            },
            {
                header: "Categories lvl0",
                hash: "categorieslvl0",
                render: ({ "categories.lvl0": lvl0 }) => renderCategories(lvl0),
            },
            {
                header: "Categories lvl1",
                hash: "categorieslvl1",
                render: ({ "categories.lvl1": lvl1 }) => renderCategories(lvl1),
            },
            {
                header: "Action",
                hideHeader: true,
                hash: "id",
                render: ({ id }) => renderAction(id),
            },
        ],
        ss_dev_products: [
            {
                header: "Name",
                hash: "name",
                render: ({...rowData}) => renderName(rowData),
            },
            {
                header: "SKU",
                hash: "sku",
                render: ({ sku }) => renderSKU(sku),
            },
            {
                header: "Parent SKU",
                hash: "sku",
                render: ({ parentSku }) => renderSKU(parentSku),
            },
            {
                header: "Product URL",
                hash: "productUrl",
                render: ({ productUrl }) => renderURL(productUrl),
            },
            {
                header: "Categories",
                hash: "categories",
                render: ({ categories }) => renderCategories(categories),
            },
            {
                header: "Categories lvl0",
                hash: "categorieslvl0",
                render: ({ "categories.lvl0": lvl0 }) => renderCategories(lvl0),
            },
            {
                header: "Categories lvl1",
                hash: "categorieslvl1",
                render: ({ "categories.lvl1": lvl1 }) => renderCategories(lvl1),
            },
            {
                header: "Categories lvl2",
                hash: "categorieslvl2",
                render: ({ "categories.lvl2": lvl2 }) => renderCategories(lvl2),
            },
            {
                header: "Action",
                hideHeader: true,
                hash: "id",
                render: ({ id }) => renderAction(id),
            },
        ]
    }

    const activeCollectionColumns = columnDefinition[activeCollection.id] || [];
    const itemsPerPageOptions = [10, 20, 50, 100];
    const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentItems, setCurrentItems] = useState<TableItem[]>([]);

    const router = useRouter();
	const onItemsPerPageChange = (newRange) => {
		setCurrentPage(1);
		setItemsPerPage(newRange);
		};

    useEffect(() => {
		const maxItems = currentPage * itemsPerPage;
		const lastItem = Math.min(maxItems, list.length);
		const firstItem = Math.max(0, maxItems - itemsPerPage);
        setCurrentItems(list?.slice(firstItem, lastItem));

	}, [currentPage, itemsPerPage, isLoading, activeCollection, list, search]);
    
	const renderName = (data: any): ReactElement => (
        <ModalInfo data={data} id={activeCollection.id} credentials={credentials} />
	); 

	const renderSKU = (sku: string): ReactElement => (<Small>{sku}</Small>);

	const renderURL = (URL: string): ReactElement => (<StyledLink href={URL} target="_blank">{URL}</StyledLink>);
	
	const renderCategories = (categories: string[]) => {
		const categoryString = categories?.join(' | ');
		if (categories?.length == 0) {
			return(<Small>-</Small>)
		} else if (!categoryString) {
			return(<Small>-</Small>)
		}
		return (<Small>{categoryString}</Small>)
	}
	const renderAction = (id: string): ReactElement => (
		<Tooltip placement="bottom" trigger={<Button
			iconOnly={<EditIcon color="secondary60" />}
			variant="subtle"
			onClick={() => router.push({
				pathname: `/collection/${id}`,
				query: { collection: activeCollection.id, url:credentials.url, apiKey: credentials.apiKey  },
			})}
		/>}>
			Edit
		</Tooltip>
	);
    return (
        <Table
            columns={activeCollectionColumns}
            items={currentItems}
            itemName={activeCollection.name}
            pagination={{
                currentPage,
                totalItems: list.length || 0,
                onPageChange: setCurrentPage,
                itemsPerPageOptions,
                onItemsPerPageChange,
                itemsPerPage,
            }}
            stickyHeader
        />)
};

export default CollectionTable;