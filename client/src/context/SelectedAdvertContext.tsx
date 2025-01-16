import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type Advert from "../types/Advert";

interface SelectedAdvertContextType {
	selectedAdvert: Advert | null;
	setselectedAdvert: (advert: Advert | null) => void;
}

const SelectedAdvertContext = createContext<
	SelectedAdvertContextType | undefined
>(undefined);

interface SelectedAdvertProviderProps {
	children: ReactNode;
}

export const SelectedAdvertProvider: React.FC<SelectedAdvertProviderProps> = ({
	children,
}) => {
	const [selectedAdvert, setselectedAdvert] = useState<Advert | null>(null);

	return (
		<SelectedAdvertContext.Provider
			value={{ selectedAdvert, setselectedAdvert }}
		>
			{children}
		</SelectedAdvertContext.Provider>
	);
};

export const useSelectedAdvert = () => {
	const context = useContext(SelectedAdvertContext);
	if (context === undefined) {
		throw new Error("");
	}
	return context;
};
