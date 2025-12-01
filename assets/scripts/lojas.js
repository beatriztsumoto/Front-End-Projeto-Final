export async function buscarLojasPorNome(nome) {
  const url = `http://localhost:3000/lojas?modo=autocomplete&nome=${encodeURIComponent(
    nome
  )}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Erro ao buscar lojas");
  }

  return await res.json();
}

export async function buscarLojasPorEndereco(endereco) {
  const url = `http://localhost:3000/lojas?modo=autocomplete&endereco=${encodeURIComponent(
    endereco
  )}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Erro ${res.status} ao buscar lojas por endereço`);
  }

  return await res.json();
}
