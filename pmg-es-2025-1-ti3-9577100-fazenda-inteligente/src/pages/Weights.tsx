import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LineChart from "@/components/dashboard/LineChart";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface PesoData {
  id: number;
  animal: number;
  animal_nome: string;
  animal_categoria: string;
  weight: string;
  date: string;
  variacao?: string;
}

export default function Weights() {
  const [dataInvalida, setDataInvalida] = useState(false);
  const [weights, setWeights] = useState<PesoData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem("access_token");

  const [animais, setAnimais] = useState<any[]>([]);

useEffect(() => {
  fetch("http://localhost:8000/api/animais/", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setAnimais(data));
}, []);

  const fetchPesagens = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/pesagens/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar pesagens");

      const data = await response.json();

      const groupedByAnimal: { [key: string]: any[] } = {};
      data.forEach((p) => {
        if (!groupedByAnimal[p.animal]) groupedByAnimal[p.animal] = [];
        groupedByAnimal[p.animal].push(p);
      });

      const withVariacao: any[] = [];
      Object.values(groupedByAnimal).forEach((pesagens: any[]) => {
        pesagens.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        pesagens.forEach((curr, index) => {
          if (index === 0) {
            curr.variacao = "0.00";
          } else {
            const anterior = pesagens[index - 1];
            const variacao = parseFloat(curr.weight) - parseFloat(anterior.weight);
            curr.variacao = variacao.toFixed(2);
          }
          withVariacao.push(curr);
        });
      });

      const pesosPorMes: { [key: string]: { label: string; peso: number } } = {};
withVariacao.forEach((p) => {
  const data = parseISO(p.date);
  const chaveOrdenada = format(data, "yyyy-MM"); // garante ordenação
  const labelMes = format(data, "MMM", { locale: ptBR }); // nome do mês
  if (!pesosPorMes[chaveOrdenada]) {
    pesosPorMes[chaveOrdenada] = { label: labelMes, peso: 0 };
  }
  pesosPorMes[chaveOrdenada].peso += parseFloat(p.weight);
});

// Agora ordena por data
const chartFormatted = Object.entries(pesosPorMes)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([_, { label, peso }]) => ({
    name: label,
    touro: peso,
  }));



      setChartData(chartFormatted);
      setWeights(withVariacao);
      setErro(null);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar pesagens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPesagens();
  }, []);

  const handleAddPesagem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const form = e.currentTarget;
    const formData = new FormData(form);
  
    const dateInput = formData.get("date") as string;
    const dataPesagem = new Date(dateInput);
    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);
    dataPesagem.setHours(0, 0, 0, 0);
  
    if (dataPesagem.toDateString() > hoje.toDateString()) {
      setDataInvalida(true);
      return;
    }    
  
    setDataInvalida(false);
  
    const newPesagem = {
      animal: Number(formData.get("animal")),
      weight: formData.get("weight"),
      date: dateInput,
    };
  
    try {
      const response = await fetch("http://localhost:8000/api/pesagens/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPesagem),
      });
  
      if (!response.ok) throw new Error("Erro ao salvar pesagem");
  
      setShowForm(false);
      form.reset();
      await fetchPesagens();
    }catch (err) {
      if (err instanceof Error) {
        const response = await fetch("http://localhost:8000/api/pesagens/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPesagem),
        });
    
        const errorText = await response.text();
        console.error("Erro ao salvar pesagem:", errorText);
      }
    }
    
  };
  

  return (
    <div className="mt-16 grid gap-4">
      <Card>
        <LineChart title="Evolução de Peso" data={chartData} dataKey="touro" />
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Histórico de Pesagens</CardTitle>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded"
          >
            {showForm ? "Cancelar" : "Adicionar Pesagem"}
          </button>
        </CardHeader>

        <CardContent>
          {showForm && (
            <form
              onSubmit={handleAddPesagem}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            >
              <select name="animal" required className="rounded border px-3 py-2">
  <option value="">Selecione o animal</option>
  {animais.map((a) => (
    <option key={a.id} value={a.id}>
      {a.name} (Tag: {a.tag})
    </option>
  ))}
</select>

              <input
                name="weight"
                type="number"
                step="0.01"
                placeholder="Peso (kg)"
                required
                className="rounded border px-3 py-2"
              />
              <input
                name="date"
                type="date"
                required
                max={new Date().toISOString().split("T")[0]}
                className={`rounded border px-3 py-2 ${dataInvalida ? "border-red-500" : "border"}`}
              />
              <button
                type="submit"
                className="col-span-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded mt-2"
              >
                Salvar Pesagem
              </button>
            </form>
          )}

          {erro ? (
            <p className="text-red-600">{erro}</p>
          ) : loading ? (
            <p>Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Animal</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Peso (kg)</TableHead>
                  <TableHead>Variação (kg)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weights.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.animal_nome}</TableCell>
                    <TableCell>{item.animal_categoria}</TableCell>
                    <TableCell>{format(parseISO(item.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{item.weight}</TableCell>
                    <TableCell>
                      <span
                        className={
                          parseFloat(item.variacao || "0") > 0
                            ? "text-green-600"
                            : parseFloat(item.variacao || "0") < 0
                            ? "text-red-600"
                            : "text-muted-foreground"
                        }
                      >
                        {parseFloat(item.variacao || "0") > 0 ? "+" : ""}
                        {item.variacao} %
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}