export const AboutSection = () => {
  return (
    <section id="quem-somos" className="py-20 bg-muted">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading">Quem somos</h2>
          <div className="section-divider"></div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <img 
              src="https://images.unsplash.com/photo-1615873968403-89e068629265?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="Nossa oficina de impressão 3D" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
          
          <div className="md:w-1/2 md:pl-10">
            <p className="text-lg mb-6 leading-relaxed">
              Na <span className="font-semibold text-primary">Carossi Parts</span>, somos apaixonados por transformar ideias em objetos reais através da tecnologia de impressão 3D. Nossa missão é democratizar o acesso à produção personalizada, permitindo que criadores, engenheiros e entusiastas concretizem seus projetos.
            </p>
            <p className="text-lg mb-6 leading-relaxed">
              Fundada por especialistas em tecnologia e design, nossa empresa combina conhecimento técnico com criatividade para oferecer soluções de impressão 3D de alta qualidade.
            </p>
            <div className="flex flex-col space-y-4">
              <div className="flex items-start">
                <div className="bg-primary p-2 rounded-full text-white mr-4">
                  <i className="fa-solid fa-bullseye"></i>
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg">Missão</h3>
                  <p>Transformar ideias em realidade através da impressão 3D, com excelência e inovação.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary p-2 rounded-full text-white mr-4">
                  <i className="fa-solid fa-eye"></i>
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg">Visão</h3>
                  <p>Ser referência em soluções de impressão 3D, reconhecida pela qualidade e criatividade.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary p-2 rounded-full text-white mr-4">
                  <i className="fa-solid fa-heart"></i>
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg">Valores</h3>
                  <p>Inovação, qualidade, sustentabilidade e compromisso com o cliente.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
