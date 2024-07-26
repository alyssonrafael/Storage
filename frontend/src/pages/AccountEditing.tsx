import EditAccountForm from "../components/forms/EditAccontForm";

function AccountEditing() {
  return (
    <div
      className="
        grid lg:grid-cols-10 lg:gap-2
        md:gap-7
        grid-cols-5 gap-3
        "
    >
      {/* Seção do título  */}
      <div className="col-span-5 lg:col-span-10 mb-10">
        <h1 className="text-3xl md:text-3xl mb-2">Edição de conta</h1>
        <p className="text-red-500">Para excluir a conta basta colocar informaçoes fficticias no email e senha</p>
      </div>
      {/* Seção com o card/formulario de ediçao */}
      <div className="col-span-5 lg:col-span-10 flex justify-center items-center h-[70vh] md:mr-4">
        <EditAccountForm />
      </div>
    </div>
  );
}

export default AccountEditing;
