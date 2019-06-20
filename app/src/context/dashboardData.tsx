// Libs
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo
} from "react";
import { drizzleReactHooks } from "drizzle-react";

type Enode = {enodeHigh: string, enodeLow: string, identifier: string, ip: string, port: string};
type Account = {address: string}

type ContextType = {
    nodeWhitelist?: Enode[],
    accountWhitelist?: Account[],
}

const DataContext = createContext<ContextType>({});

/**
 * Provider for the data context that contains the whitelist
 * @param {Object} props Props given to the DataProvider
 * @return The provider with the following value:
 *  - nodeWhitelist: list of whiteliist enode from Node Rules contract
 *  - setNodeWhitelist: setter for the whitelist state
 */
export const DataProvider: React.FC = (props: React.Props<{}>) => {
    const [nodeWhitelist] = useState<Enode[]>([]);
    const [accountWhitelist] = useState<Account[]>([]);
    const value = useMemo(() => ({ nodeWhitelist, accountWhitelist }), [
        nodeWhitelist,
        accountWhitelist
    ]);
    return <DataContext.Provider value={value} {...props} />;
};

/**
 * Fetch the appropriate data on chain and synchronize with it
 * @return {Object} Contains data of interest:
 *  - admins: list of admin address from Admin contract,
 *  - dataReady: true if isReadOnly, whitelist and admins are correctly fetched,
 *  false otherwise
 *  - userAddress: Address of the user
 *  - isAdmin: true if address of the user is includes in the admin list
 *  - node: Object containing node relevant data
 *    - isReadOnly: Rules contract is lock or unlock,
 *    - whitelist: list of whitelist enode from Rules contract,
 */
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider.");
    }

    const { drizzle, useCacheCall } = drizzleReactHooks.useDrizzle();
    const { nodeWhitelist, accountWhitelist } = context;
    const nodeIsReadOnly: boolean = useCacheCall("NodeRules", "isReadOnly");

    const { userAddress } = drizzleReactHooks.useDrizzleState((drizzleState: any) => ({
        userAddress: drizzleState.accounts[0]
    }));

    const admins: string[] = useCacheCall("Admin", "getAdmins");

    const dataReady = useMemo(
        () =>
            typeof nodeIsReadOnly === "boolean" &&
            Array.isArray(admins) &&
            Array.isArray(nodeWhitelist) &&
            Array.isArray(accountWhitelist),
            [nodeIsReadOnly, admins, nodeWhitelist, accountWhitelist]
    );

    const isAdmin = useMemo(
        () => (dataReady ? admins.includes(userAddress) : false),
        [dataReady, admins, userAddress]
    );

    const formattedAdmins = useMemo(() => {
        return admins
            ? admins
                  .map(address => ({
                      address,
                      identifier: address,
                      status: "active"
                  }))
                  .reverse()
            : undefined;
    }, [admins]);

    return {
        userAddress,
        dataReady,
        isAdmin,
        admins: formattedAdmins
    };
};
