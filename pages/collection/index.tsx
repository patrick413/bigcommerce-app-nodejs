import { Box, Button, Dropdown, Flex, FlexItem, H2, Panel, Form, FormGroup, Input, H1} from "@bigcommerce/big-design";
import { SearchIcon, ArrowDropDownIcon,} from "@bigcommerce/big-design-icons";
import { useEffect, useState} from "react";
import ErrorMessage from "../../components/error";
import Loading from "../../components/loading";
import { useCollectionList } from "../../lib/hooks";
import CollectionTable from "@components/collectionTable";
import ModalAdd from "@components/modals/addModal";

const Collections = () => {
	const [credentials, setCredentials] = useState({
		url: '',
		apiKey: '',
	});
	const [activeCollection, setActiveCollection] = useState({id:"ss_dev_products", name:"Products"});
	const { error, isLoading, list = [] } = useCollectionList(credentials.url, credentials.apiKey, activeCollection.id, 'export');
	const [searchKeyWords, setSearchKeyword] = useState('')
	const [filteredItems, setFilteredItems] = useState(list);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const url = localStorage.getItem('typeSenseURL') || '';
			const apiKey = localStorage.getItem('typeSenseApiKey') || '';
			setCredentials({
				url,
				apiKey,
			});
		}
	}, []);
	useEffect(() => {
		setFilteredItems(list)
	}, [isLoading,activeCollection,credentials.url, credentials.apiKey])

	if (credentials.url.length == 0) {
		return(<Panel>
			<H1>Please Provide URL and API Key</H1>
		</Panel>)
	}
	if (isLoading) return <Loading />;
	if (error) return <ErrorMessage error={error} />;

	const onSearchChange = (e) => {
    	setSearchKeyword(e.target.value);
		if (searchKeyWords.length === 0) {
            setFilteredItems(list);
        } else {
			const filteredList = searchItem(list, searchKeyWords);
            setFilteredItems(filteredList);
		}
	}
	const onFormSubmit = (e) => {
		e.preventDefault()
		if (searchKeyWords.length === 0) {
            setFilteredItems(list);
        } else {
			const filteredList = searchItem(list, searchKeyWords);
            setFilteredItems(filteredList);
		}
	}
	const searchItem = (list, search) => {
        return list.filter((item) => {
            for (const key in item) {
				const propertyValue = String(item[key]);
				if (propertyValue.toLowerCase().includes(search.toLowerCase())) {
					return true;
				}
			}
			return false;
        })
	}
	
	return (
		<Panel id="products">
			<Flex justifyContent="space-between" alignItems="center">
				<FlexItem flexGrow={1} marginRight="xxxLarge">
					<H2>{ activeCollection.name }</H2>
				</FlexItem>
				<FlexItem flexGrow={4}>
					<Form fullWidth onSubmit={onFormSubmit}>
						<FormGroup>
							<Input
								iconRight={<SearchIcon color="primary" />}
								placeholder="Search"
								onChange={onSearchChange}
								onPaste={onSearchChange}
								onInput={onSearchChange}
							/>
						</FormGroup>
					</Form>
				</FlexItem>
				<FlexItem marginLeft="auto" flexGrow={1}>
					<Flex justifyContent="flex-end">
						<Box display="inline-block" marginRight="small">
							<Dropdown
								items={[
									{
									content: 'Product',
									onItemClick: (item) => { setActiveCollection({id:item.hash, name:item.content}) },
									hash: 'ss_dev_products',
									},
									{
									content: 'Variants',
									onItemClick: (item) => { setActiveCollection({id:item.hash, name:item.content}) },
									hash: 'ss_dev_variants',
									},
								]}
								maxHeight={250}
								placement="bottom-start"
								toggle={<Button variant="subtle" iconRight={<ArrowDropDownIcon />}>{activeCollection.name}</Button>}
							/>
						</Box>
						<Box display="inline-block">
							<ModalAdd collection={activeCollection} url={credentials.url} apiKey={credentials.apiKey} />
						</Box>	
					</Flex>	
				</FlexItem>
			</Flex>
			<CollectionTable list={filteredItems} isLoading={isLoading} activeCollection={activeCollection} search={searchKeyWords} credentials={credentials}/>
		</Panel>
	);
};

export default Collections;