// interfaces gerais
 export interface Categoria {
    id: number;
    nome: string;
  }
export interface Product {
    id: number;
    nome: string;
    preco: number;
    quantidade: number;
    disponivel: boolean;
    categoriaId: number;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    categoria: {nome: string}
  }
  
  export interface SaleItem {
    id: number;
    vendaId: number;
    produtoId: number;
    quantidade: number;
    produto: Product;
    createdAt: string;
    updatedAt: string;
  }
 
  export interface User {
    id?: string;
    name: string;
    email?: string;
    password?: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Sale {
    id: number;
    data: string;
    total: number;
    desconto: number;
    userId: string;
    observacao: string;
    formaDePagamento: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    produtos: SaleItem[];
    user: User;
  }
  //  types gerais
  export type SalesData = Sale[];
  //types e interfaces usados pela tabela de produtos
  export interface ProductData {
    id: number;
    nome: string;
    preco: number;
    quantidade: number;
    categoria: { nome: string };
    disponivel: boolean;
    deleted?: boolean; 
    createdAt: string; 
    updatedAt: string; 
  }
  export interface ProductForm {
    nome: string;
    preco: number;
    quantidade: number;
    categoria: Categoria;
    categoriaId: number;
    disponivel: boolean;
  }
  export type ArrayProductData = Array<{
    id: number;
    nome: string;
    preco: number;
    quantidade: number;
    categoria: { nome: string };
    categoriaId:number;
    disponivel: boolean;
    deleted?: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
//fim dos types e interfaces usados pela tabela de produtos