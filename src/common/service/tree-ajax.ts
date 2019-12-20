import { api } from 'common/api/index';
import { ITeachDirectoryMaterialList, IMaterialSectionResponseResult, IChapterResponseDtoListItem,
    ISectionItem, IMaterialListResponseResult } from 'common/api/api-interface';
import { cloneDeep } from 'lodash';

export interface IMenuItem {
    name: string;
    key: string;
    value: any;
    weight: number;
    isLeaf: boolean;
    id: number;
    children?: IMenuItem[];
    [key: string]: any;
}

/** 匹配最外层节点的key的关键内容 */
export const matchOutermostLayerKey = 'outermost';

/** 
 * @func
 * @desc 加载最外层级目录菜单
 */
export const loadMaterialMenu = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        api.materialList().then((res: IMaterialListResponseResult) => {
            if (res.status === 200 && res.data.success) {
                const { result } = res.data;
                const { teachMaterialList }: {teachMaterialList: ITeachDirectoryMaterialList[]} = result
                const menus: IMenuItem[] = teachMaterialList.map((item: ITeachDirectoryMaterialList) => {
                    return {
                        name: item.title,
                        key: `${item.materlId}-${matchOutermostLayerKey}`,
                        value: item.materlId,
                        children: [],
                        id: item.id,
                        isLeaf: false,
                        weight: item.weight
                    };
                }).sort((x: IMenuItem, y: IMenuItem) => {
                    return y.weight - x.weight;
                });

                resolve(menus);
            } else {
                resolve([]);
            }
        });
    });
}

export const loadSectionList = (params: FormData, treeNode: any, sourceMenu: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        api.sectionList(params).then((res: IMaterialSectionResponseResult) => {
            if (res.status === 200 && res.data.result) {
                const { chapterResponseDtoList }: { chapterResponseDtoList: IChapterResponseDtoListItem[] } = res.data.result;
                const { value } = treeNode.props.dataRef;
                const menus: IMenuItem[] = chapterResponseDtoList.map((chapter: IChapterResponseDtoListItem, index: number) => {
                    const item: ISectionItem = chapter.section;
                    return {
                        name: item.name,
                        key: `${value}-${index}-${item.id}`,
                        value: item.chapterId,
                        id: item.id,
                        isLeaf: true,
                        weight: item.weight,
                        teachChapterList: chapter.teachChapterList,
                        children: []
                    };
                }).sort((x: IMenuItem, y: IMenuItem) => {
                    return y.weight - x.weight;
                });

                menus.forEach((menu: IMenuItem) => {
                    treeNode.props.dataRef.children.push({
                        title: menu.name,
                        key: menu.key
                    });
                });

                const menusState: IMenuItem[] = cloneDeep(sourceMenu);
                const target: IMenuItem = menusState.find((item: IMenuItem, index: number) => item.value === value)!;
                target.children! = menus;
                // showList为展示列表
                resolve({ menusState, showList: menus });
            } else {
                reject(res.data ? res.data.desc : '当前课程没有章节');
            }
        });
    });
}