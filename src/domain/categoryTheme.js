const CATEGORY_THEME = {
  추천: { bg: '#FFF3E0', border: '#FFCC80', text: '#B26A00' },
  전체보기: { bg: '#F5F5F5', border: '#D7CCC8', text: '#5D4037' },
  한그릇: { bg: '#FCE4EC', border: '#F8BBD0', text: '#AD1457' },
  '죽/리조또': { bg: '#FFF8E1', border: '#FFE082', text: '#8D6E00' },
  '국/탕': { bg: '#E3F2FD', border: '#90CAF9', text: '#1565C0' },
  단백질: { bg: '#E8F5E9', border: '#A5D6A7', text: '#2E7D32' },
  반찬: { bg: '#F3E5F5', border: '#CE93D8', text: '#6A1B9A' },
  주먹밥: { bg: '#E0F7FA', border: '#80DEEA', text: '#006064' },
  면: { bg: '#FFF3E0', border: '#FFB74D', text: '#E65100' },
  '토스트/팬케이크': { bg: '#FFFDE7', border: '#FFF176', text: '#795548' },
  '퓨레/소스': { bg: '#E8EAF6', border: '#9FA8DA', text: '#303F9F' },
  간식: { bg: '#FBE9E7', border: '#FFAB91', text: '#BF360C' }
}

const DEFAULT_THEME = { bg: '#F7F7F7', border: '#E0E0E0', text: '#5D4037' }

export function getCategoryTheme(category) {
  return CATEGORY_THEME[category] || DEFAULT_THEME
}

export default CATEGORY_THEME
