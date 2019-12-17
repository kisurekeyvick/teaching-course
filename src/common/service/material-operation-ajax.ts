/** 
 * @desc (取消)收藏 (取消)点赞
 */
import { dictionary, IDictionaryItem, matchFieldFindeTarget } from 'common/dictionary/index';
import { IMaterialOptionRequest, IMaterialOptionResponseResult, ITeachChapterList } from 'common/api/api-interface';
import { api } from 'common/api/index';

const materialOperation: IDictionaryItem[] = dictionary.get('material-operation')!

export type IHandleMaterialOperation = ({ operation }: {
    operation: string;
    sourceItem: ITeachChapterList;
}) => {}

export const handleMaterialOperation: IHandleMaterialOperation = async ({
    operation,
    sourceItem
}) => {
    const type: number = +(matchFieldFindeTarget(materialOperation, { name: operation })!.value);
    const getConfirm = (): number => {
        /** 如果处于收藏状态，那么返回2，2代表取消点赞 */
        if (operation === 'collect' && sourceItem.isCollect) {
            return 2;
        }
        /** 逻辑同上 */
        if (operation === 'praise' && sourceItem.isPraise) {
            return 2;
        }

        return 1;
    }

    const params: IMaterialOptionRequest = {
        type,
        ...(type === 3 || type === 4) && { confirm: getConfirm() },
        id: sourceItem.chapterId
    };

    await api.materialOption(params).then((res: IMaterialOptionResponseResult) => {
        if (res.status === 200 && res.data.success) {
            return true;
        } else {
            return false;
        }
    });
}