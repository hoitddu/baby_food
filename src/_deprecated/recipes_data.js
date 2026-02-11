// 🧑‍🍳 엄마표 레시피 관리 파일

export const earlyStage = [
    {
        name: "소고기 수해",
        ingredients: "소고기 20g, 쌀 20g, 물 200ml",
        instructions: `
1. 쌀을 30분간 불립니다.
2. 핏물을 뺀 소고기를 삶은 뒤, 믹서에 갑니다.
3. 냄비에 쌀가루와 소고기를 넣고 센 불에서 끓이다가, 약불로 줄여 5분간 저어줍니다.
4. 체에 걸러 완성합니다.
    `
    },
    {
        name: "애호박 미음",
        ingredients: "불린 쌀 15g, 애호박 10g, 물 150ml",
        instructions: `
1. 쌀을 믹서에 갑니다.
2. 애호박은 껍질과 똥를 제거하고 찝니다.
3. 찐 애호박을 체에 내립니다.
4. 쌀과 애호박, 물을 넣고 끓입니다.
    `
    }
];

export const middleStage = [
    {
        name: "닭고기 시금치 죽",
        ingredients: "닭안심 30g, 시금치 20g, 쌀 30g, 채수 300ml",
        instructions: `
1. 닭고기는 힘줄을 제거하고 삶아서 다집니다.
2. 시금치는 데쳐서 잘게 다집니다.
3. 불린 쌀, 닭고기, 육수를 넣고 끓이다가 쌀이 퍼지면 시금치를 넣습니다.
4. 농도를 확인하며 완성합니다.
    `
    }
];

export const snacks = [
    {
        name: "고구마 치즈 볼",
        ingredients: "고구마 1개, 아기 치즈 1장",
        instructions: `
1. 고구마를 쪄서 뜨거울 때 으깹니다.
2. 으깬 고구마에 치즈를 섞어 반죽합니다.
3. 동그랗게 빚어 에어프라이어 160도에서 10분 굽습니다.
    `
    }
];

export const sideDishes = [
    {
        name: "두부 스테이크",
        ingredients: "두부 반 모, 다진 야채(당근, 양파), 계란 1개, 전분가루",
        instructions: `
1. 두부는 물기를 꼭 짜서 으깹니다.
2. 야채는 잘게 다져 볶습니다.
3. 두부, 야채, 계란, 전분가루를 섞어 반죽합니다.
4. 달궈진 팬에 기름을 조금 두르고 노릇하게 굽습니다.
    `
    }
];

// 이 부분을 통해 모든 카테고리를 하나로 합쳐서 앱에 전달합니다.
export const recipes = [
    ...earlyStage.map(r => ({ ...r, category: "초기 이유식" })),
    ...middleStage.map(r => ({ ...r, category: "중기 이유식" })),
    ...snacks.map(r => ({ ...r, category: "간식" })),
    ...sideDishes.map(r => ({ ...r, category: "유아식 반찬" }))
];
