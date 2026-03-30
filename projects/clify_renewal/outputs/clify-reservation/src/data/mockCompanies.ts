export interface CompanyData {
  id: string;
  domain: string;
  name: string;
  pointBalance: number;
}

export const mockCompanies: CompanyData[] = [
  {
    id: 'company-1',
    domain: 'samsung.com',
    name: '삼성전자',
    pointBalance: 500000,
  },
  {
    id: 'company-2',
    domain: 'lg.com',
    name: 'LG전자',
    pointBalance: 300000,
  },
  {
    id: 'company-3',
    domain: 'hyundai.com',
    name: '현대자동차',
    pointBalance: 450000,
  },
  {
    id: 'company-4',
    domain: 'naver.com',
    name: '네이버',
    pointBalance: 250000,
  },
  {
    id: 'company-5',
    domain: 'kakao.com',
    name: '카카오',
    pointBalance: 280000,
  },
];

export const getCompanyByDomain = (domain: string): CompanyData | undefined => {
  return mockCompanies.find(
    (company) => domain.toLowerCase().endsWith(company.domain.toLowerCase())
  );
};
