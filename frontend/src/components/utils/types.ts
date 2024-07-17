export interface Product {
    id: number;
    nome: string;
    preco: number;
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
  //so o name e obrigatorio nessa interface para nao ter que passar todas as informaçoes quando so preciso do nome
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
  
  export type SalesData = Sale[];
  