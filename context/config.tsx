import { createContext, useContext, useState } from 'react';
interface ConfigContextData {
    searchConfig: {
        bgColor: string;
        borderColor: string;
        categories: boolean;
        displayPrice: boolean;
        filter: boolean;
        placeholder: string;
        prodDescription:string;
        position: {
        value: string;
        content: string;
        };
        view: {
            value: string;
            content: string;
        };
        hitsPerPage: number;
        searchAttributes: [{
            name: string;
            isActive: boolean;
            sort:string
        }]
    };
    searchId: any;
    updateConfig: (value: any) => void;
    updateID: (id: any) => void;
}
const ConfigContext = createContext({} as ConfigContextData);
const ConfigProvider = ({ children }) => {
    const [searchConfig, setSearchConfig] = useState({})
    const [searchId, setSearchId] = useState('')
    const updateConfig = (value:any) => {
        setSearchConfig(value);
    }
    const updateID = (id: any) => {
        setSearchId(id)
    }
    return (
        <ConfigContext.Provider value={{ searchConfig, searchId,  updateConfig, updateID}}>
            {children}
        </ConfigContext.Provider>
    )
}

export const useConfig = () => useContext(ConfigContext);

export default ConfigProvider;