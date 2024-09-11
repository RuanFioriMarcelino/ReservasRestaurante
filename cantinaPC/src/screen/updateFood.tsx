import { Input } from "../components/input";

interface Foods {
  id: string;
  name: string;
  description: string;
  valor: string;
  imgURL: string;
}
function UpdateFood({ name }: Foods) {
  console.log(name);
  return (
    <div className="flex justify-around">
      <form className="w-1/2 gap-3 grid">
        <h1 className="text-yellow font-bold text-xl uppercase text-center mb-4">
          Editar produto
        </h1>
        <Input icon={null}>
          <Input.Field placeholder="Nome" />
        </Input>
        <Input icon={null}>
          <Input.Field placeholder="Descrição" />
        </Input>
        <Input icon={null}>
          <Input.Field placeholder="Valor" />
        </Input>
        <Input icon={null}>
          <select className="flex-1 cursor-pointer">
            <option value="">Selecione um gênero</option>
            <option value="almoco">Almoço</option>
            <option value="marmitex">Marmitex</option>
            <option value="bebida">Bebida</option>
          </select>
        </Input>

        <input
          type="file"
          accept="image/png, image/jpeg"
          className="file:bg-white file:text-yellow fonte file:border-none file:w-full file:h-10 file:rounded-lg file:hover:bg-yellow file:hover:text-white file:font-bold file:transition-all file:ease-in file:duration-75 file:cursor-pointer"
        />
        {/*   {!imgURL && <progress className="w-full " value={progress} max="100" />} */}

        <button type="submit" title="Cadastrar">
          GRAVAR
        </button>
      </form>
      <div className="items-center justify-center flex-1 max-h-80 max-w-80 rounded-lg border-4 border-yellow">
        {/*   {imgURL && (
          <img className="w-full  rounded-sm " src={imgURL} alt="Imagem" />
        )} */}
      </div>
    </div>
  );
}

export default UpdateFood;
