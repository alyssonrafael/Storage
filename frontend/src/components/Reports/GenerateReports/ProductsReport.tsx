import { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { BsFileEarmarkBarGraph } from "react-icons/bs";

const ProductsReportGenerator = () => {
  // Estados para armazenar os valores dos inputs e a lista de categorias
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [disponivel, setDisponivel] = useState<string | undefined>('');
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([]);

  useEffect(() => {
    // Função para buscar categorias
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/categorias'); // Faz uma requisição GET para obter as categorias
        setCategorias(response.data); // Atualiza o estado com as categorias obtidas
      } catch (error) {
        console.error('Erro ao buscar categorias:', error); // Exibe erro no console caso ocorra
      }
    };

    fetchCategorias(); // Chama a função para buscar categorias quando o componente é montado
  }, []);

  const handleGenerateReport = async () => {
    try {
      // Faz uma requisição GET para gerar o relatório de produtos
      const response = await axios.get('http://localhost:3333/api/relatorios/produtos', {
        params: {
          categoriaId: categoriaId ? parseInt(categoriaId) : undefined, // Converte categoriaId para número inteiro se estiver definido
          disponivel: disponivel !== '' ? disponivel === 'true' : undefined, // Converte disponivel para booleano se estiver definido
          formato: 'excel', // Define o formato como Excel
        },
        responseType: 'blob', // Define o tipo de resposta como blob para lidar com arquivos
      });

      // Cria um objeto Blob com o tipo correto
      const file = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Usa file-saver para salvar o arquivo
      saveAs(file, 'relatorio-produtos.xlsx');
    } catch (error) {
      console.error('Erro ao gerar o relatório:', error); // Exibe erro no console caso ocorra
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-blaze-orange-500">Gerar Relatório de Produtos</h1>
      <div className='flex space-x-4'>
        <div className="mb-4 w-1/2">
          <label className="block mb-2">Categoria:</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="p-2 w-full border text-xs md:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white "
          >
            <option value="">Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>
      
        <div className="mb-4 w-1/2">
          <label className="block mb-2">Disponível:</label>
          <select
            value={disponivel}
            onChange={(e) => setDisponivel(e.target.value)}
            className="p-2 w-full border text-xs md:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white"
          >
            <option value="">Todos</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>
      </div>
      <button
        onClick={handleGenerateReport}
        className="bg-blaze-orange-500 text-white py-2 px-4 rounded-xl flex justify-center items-center space-x-4"
      >
        <BsFileEarmarkBarGraph className='text-2xl'/>
        <p>Gerar Relatório</p>
      </button>
    </div>
  );
};

export default ProductsReportGenerator;
