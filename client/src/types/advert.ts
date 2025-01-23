type MainTag = {
	id: number;
	name: string;
	subTags: SubTag[];
};

type SubTag = {
	id: number;
	name: string;
};

export type { MainTag, SubTag };
