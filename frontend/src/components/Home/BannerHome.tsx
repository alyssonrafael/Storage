import { useEffect, useState } from "react"; //estado e efeito
import { decodeToken } from "../utils/tokenUtils";//decodificaçao do doken
import { User } from "../utils/types"; //importaçao do types do user
import api from "../../api";

function BannerHome() {

  const [user, setUser] = useState<User | null>(null); //estado para informaçoes do usuario
//efeito para trazer as informaçoes do user assim que o componente e montado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,//token na requisiçao
          },
        };
        api
          .get(`/user/${decoded.userId}`, config)
          .then((response) => {
            const { name } = response.data;
            setUser({ name });
          })
          .catch((error) => console.error("Erro ao buscar usuário:", error));
      }
    }
  }, []);
//componente do banner
  return (
    /* propriedades para responsividade do grid (sem prefixo e para telas pequenas md:para telas medias
     lg:para desktop se uma propriedade nao tiver outra que a anule ela permanece em todos os tipos)*/
    <div className=" bg-blaze-orange-500 rounded-2xl
    lg:col-span-6 lg:relative lg:mt-16 lg:row-start-2 
    md:col-span-5 md:row-start-1 
    col-span-5 row-start-1
    ">
      <div className="flex items-center lg:relative">
        <div className="mr-4">
          <img
            src="/undraw_business_deal_re_up4u 1.svg"
            alt="business deal"
            className="max-w-full h-auto max-h-52 lg:-mt-16"
          />
        </div>
        <div className="md:mr-16 mr-4">
          <h1 className="md:text-2xl font-semibold">
            Seja Bem-vindo,{" "}
            <span className="text-white md:text-lg font-bold ">
              {/* condicional para aguardadr a requisiçao e nao ficar sem mostrar nada */}
              {user ? user.name.toUpperCase() : "Carregando..."}
            </span>
          </h1>
          <p className="md:text-base text-sm">Tenha um ótimo dia, e boas vendas</p>
        </div>
      </div>
      <div className="hidden md:block
       lg:right-4 lg:bottom-4 lg:top-auto
       md:right-10 md:top-60 md:absolute 
      ">
        <img src="/Storage.svg" alt="storage logo" className="md:w-12 md:h-12" />
      </div>
    </div>
  );
}

export default BannerHome;
