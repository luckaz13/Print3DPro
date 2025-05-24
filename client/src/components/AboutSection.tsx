import { getAssetPath } from "@/lib/utils";

export const AboutSection = () => {
  return (
    <section id="quem-somos" className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-heading">Quem somos</h2>
          <div className="section-divider"></div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <img
              src={getAssetPath("/2.jpg")}
              alt="Nossa oficina de impressão 3D"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
          
          <div className="md:w-1/2 md:pl-10">
            <p className="text-lg mb-6 leading-relaxed">
              Na <span className="font-semibold text-primary">Carossi Parts</span>, damos vida às suas ideias por meio da impressão 3D personalizada. Produzimos peças sob medida em materiais de alta qualidade, como PLA e PETG, atendendo desde protótipos funcionais até itens decorativos. Também confeccionamos action figures coloridas e pintadas à mão, com acabamento artesanal e atenção a cada detalhe — perfeitas para colecionadores e entusiastas.
            </p>
            <p className="text-lg mb-6 leading-relaxed">
              Nosso compromisso é com a excelência em todas as etapas, do planejamento à entrega, garantindo resultados que superam expectativas. Unimos criatividade e precisão tecnológica para oferecer soluções versáteis a criadores, hobistas, engenheiros e pequenas empresas.
            </p>
            <p className="text-lg mb-6 leading-relaxed">
              Cada projeto é personalizado, pensado para atender às necessidades específicas de nossos clientes, equilibrando funcionalidade e estética. Oferecemos orçamento gratuito, atendimento próximo e comunicação transparente durante todo o processo. Envie sua ideia e transforme seu projeto em realidade com a qualidade e o cuidado que são a marca da <span className="font-semibold text-primary">Carossi Parts</span>. Construímos, dia após dia, uma reputação baseada em confiança, inovação e total compromisso com a sua satisfação.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
