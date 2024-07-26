import UsersList from "../components/UserManagement/UsersList";

function UserManagement() {
    return (
        <div
          className="
            grid lg:grid-cols-10 lg:gap-2
            md:gap-7
            grid-cols-5 gap-3
            "
        >
          {/* Seção do título e subtitulo  */}
          <div className="col-span-5 lg:col-span-10 mb-10">
            <h1 className="text-3xl md:text-3xl mb-2">Usuarios No Sistema</h1>
            <p className="text-red-500">Ao mudar a função ela so sera valida apartir do proximo login altere com cuidado</p>
          </div>
          {/* Seção com a lista de usuarios*/}
          <div className="col-span-5 lg:col-span-10 md:mr-4">
          <h1 className="text-2xl font-bold text-blaze-orange-500 mb-4">Lista de Usuários</h1>
           <UsersList/>
          </div>
        </div>
      );
}

export default UserManagement