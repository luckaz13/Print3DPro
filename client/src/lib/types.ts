export interface SocialLinkType {
  name: string;
  icon: string;
  url: string;
  tooltip: string;
}

export interface PortfolioItemType {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
}

export type PortfolioCategoryType = "Todos" | "Peças Técnicas" | "Decorativos" | "Acessórios";
