import { useState } from "react";

const ProcessarImagem = () => {
  const [backgroundimage, setImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file) return;

    setImage(file);
    setProcessedImage(null);

    // assim que o usuário envia, já dispara o processo todo
    await handleRemoveBackground(file);
  };

  const handleRemoveBackground = async (file: File) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image_file", file);

    try {
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": "2J4Zb7V3cULqcYMtRw1Pdcey", // sua chave
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao remover fundo");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // agora que já removeu o fundo, já chama o próximo passo
      await handleAddBackground(url);
    } catch (err) {
      if (err instanceof Error) {
        alert("Erro: " + err.message);
      } else {
        alert("Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddBackground = async (fgUrl: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const background = new Image();
    const fgImage = new Image();

    background.src = "/Imagens/removerfundo.png"; // fundo escolhido
    fgImage.src = fgUrl;

    await Promise.all([
      new Promise((resolve, reject) => {
        background.onload = resolve;
        background.onerror = () => reject(new Error("Erro ao carregar fundo"));
      }),
      new Promise((resolve, reject) => {
        fgImage.onload = resolve;
        fgImage.onerror = () => reject(new Error("Erro ao carregar imagem processada"));
      }),
    ]);

    canvas.width = fgImage.width;
    canvas.height = fgImage.height;

    if (ctx) {
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(fgImage, 0, 0, canvas.width, canvas.height);

      const finalImageUrl = canvas.toDataURL("image/webp");
      setProcessedImage(finalImageUrl);
    } else {
      alert("Erro: Não foi possível obter o contexto do canvas.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Remover Fundo de Imagem</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {backgroundimage && <p>Imagem carregada: {backgroundimage.name}</p>}

      {loading && <p>Processando...</p>}

      {processedImage && (
        <div style={{ marginTop: "20px" }}>
          <h3>Resultado com fundo:</h3>
          <img src={processedImage} alt="Com fundo" style={{ maxWidth: "300px" }} />
          <a href={processedImage} download="com-fundo.webp">
            Baixar imagem
          </a>
        </div>
      )}
    </div>
  );
};

export default ProcessarImagem;
