import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, Panel, Form, FormGroup, Input, H2, Small, Button, Flex, FlexItem, createAlertsManager, AlertProps, AlertsManager,  MessagingType } from "@bigcommerce/big-design";
import styled from "styled-components";
import { useCredentials } from "../lib/hooks";
import { collectionChecker } from './api/collections';
import Loading from '@components/loading';
import ErrorMessage from '@components/error';


const alertsManager = createAlertsManager()

const Index = () => {
	const { error, isLoading, summary, mutateList } = useCredentials()
  	const [formData, setFormData] = useState({
		url: '',
		apiKey: '',
		// searchKey: '',
	});
	const template = `
			"nav  main" auto
			/ 1.5fr 5fr;
		`;
	useEffect(() => {
		if (!isLoading && summary && summary.url && summary.apiKey) {
			setFormData({
				url: summary.url,
				apiKey: summary.apiKey,
			});
		}
	},[isLoading])
	
	const onFormSubmit = async (e) => {
		e.preventDefault()
 
		try {
			const generateAlert = (response) => {
			const header = response.status === 200 ? 'Success' : 'Error Checking your credentials';
			const text =
				response.status === 200
				? 'Your credentials are valid.'
				: `Message: ${response.statusText}`;

			return {
				header,
				messages: [{ text }],
				type: response.status === 200 ? 'success' : 'error' as MessagingType,
				onClose: () => null,
			};
			};

			const response = await collectionChecker(formData.url, formData.apiKey);
			const alert: AlertProps = generateAlert(response);
			alertsManager.clear();
			alertsManager.add(alert);

			if (response.status === 200) {
				localStorage.setItem('typeSenseURL', formData.url);
				localStorage.setItem('typeSenseApiKey', formData.apiKey);
			}

			setTimeout(() => {
			alertsManager.clear();
			}, 4000);
		} catch (error) {
			console.error(error)
		}
	};

		const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	if (isLoading) return <Loading />;
	if (error) return <ErrorMessage error={error} />;
	return (
		<Panel id="config">
		<AlertsManager manager={alertsManager} />
		<Grid gridTemplate={template} padding="large">
			<GridItem gridArea="nav">
			<Box
				backgroundColor="primary"
				color="white"
				border="box"
				display="block"
				padding="medium"
			>
				<Small color="primary20">Credentials</Small>
			</Box>
			</GridItem>
			<GridItem gridArea="main" paddingLeft="large">
			<Box>
				<Box marginBottom="large">
				<H2>Credentials</H2>
				<Small>Provide TypeSense URL, API Key, Search Key</Small>
				</Box>
				<Form fullWidth onSubmit={onFormSubmit}>
				<FormGroup>
					<Input
					label="URL"
					required
					type="text"
					name="url"
					value={formData.url}
					onChange={handleInputChange}
					/>
				</FormGroup>
				<FormGroup>
					<Input
					label="API Key"
					required
					type="text"
					name="apiKey"
					value={formData.apiKey}
					onChange={handleInputChange}
					/>
				</FormGroup>
				<Flex justifyContent="flex-end">
					<FlexItem marginTop="xxLarge">
					<Button variant="secondary">Discard</Button>
					<Button variant="primary" type="submit">Submit</Button>
					</FlexItem>
				</Flex>
				</Form>
			</Box>
			</GridItem>
		</Grid>
		</Panel>
	);
	};

	const StyledBox = styled(Box)`
	min-width: 10rem;
	`;

	export default Index;
