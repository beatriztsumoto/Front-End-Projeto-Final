export async function buscarLojasPorNome(nome) {
  const url = `http://localhost:3000/lojas?modo=autocomplete&nome=${encodeURIComponent(nome)}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Erro ao buscar lojas");
  }

  return await res.json();
}