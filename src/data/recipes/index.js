import { earlyStage } from './earlyStage'
import { middleStage } from './middleStage'
import { snacks } from './snacks'
import { sideDishes } from './sideDishes'

// 모든 레시피를 합쳐서 내보냅니다.
// 각 파일에서 가져온 데이터에 'category' 이름을 붙여줍니다.

export const recipes = [
    ...earlyStage.map(r => ({ ...r, category: "초기 이유식" })),
    ...middleStage.map(r => ({ ...r, category: "중기 이유식" })),
    ...snacks.map(r => ({ ...r, category: "간식" })),
    ...sideDishes.map(r => ({ ...r, category: "유아식 반찬" }))
];
