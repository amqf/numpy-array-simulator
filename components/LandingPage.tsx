import React from 'react';
import { Layers, AlertTriangle, ArrowRight, Play, Brain, Eye } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-numpy-blue selection:text-white overflow-y-auto custom-scrollbar">
      
      {/* Navbar Simple */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-numpy-blue to-numpy-dark w-8 h-8 rounded-md flex items-center justify-center shadow-lg">
              <span className="font-bold text-white text-xs">N</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Array Lab</span>
          </div>
          <button 
            onClick={onStart}
            className="text-sm font-medium text-numpy-blue hover:text-white transition"
          >
            Acessar Simulador
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-numpy-blue/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Versão 1.0 (Interactive Mode)
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            Domine a memória do <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-numpy-blue to-cyan-400">NumPy Visualmente</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Pare de visualizar arrays como tabelas mágicas. Entenda <strong>strides</strong>, <strong>shapes</strong> e <strong>alocação de memória</strong> vendo os bytes se moverem em tempo real.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={onStart}
              className="group bg-numpy-blue hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
            >
              <Play size={20} className="fill-current" />
              Iniciar Laboratório
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#features" className="px-8 py-4 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition border border-transparent hover:border-slate-700">
              Como funciona?
            </a>
          </div>
        </div>
      </header>

      {/* Demo Preview (Image placeholder or CSS mock) */}
      <div className="max-w-6xl mx-auto px-6 -mt-20 mb-32 relative z-10">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl shadow-black/50">
          <div className="bg-slate-950 rounded-lg border border-slate-800 aspect-[16/9] flex items-center justify-center relative overflow-hidden group">
             {/* Abstract Grid Representation */}
             <div className="grid grid-cols-4 gap-2 opacity-50 group-hover:opacity-75 transition duration-700 scale-90 group-hover:scale-100">
                {Array.from({length: 12}).map((_,i) => (
                  <div key={i} className="w-16 h-16 border border-slate-700 rounded bg-slate-800/50 flex items-center justify-center text-slate-600 font-mono">
                    {i}
                  </div>
                ))}
             </div>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full border border-slate-700 text-sm text-slate-300">
                  Ambiente de Simulação Ativo
                </span>
             </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 border border-purple-500/20">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Modelo Mental Correto</h3>
              <p className="text-slate-400 leading-relaxed">
                Aprenda que arrays são apenas blocos lineares de memória. O <em>shape</em> é apenas uma ilusão criada pelos strides.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Visualização Dupla</h3>
              <p className="text-slate-400 leading-relaxed">
                Veja a representação N-Dimensional (humana) e a Memória Física (computador) sincronizadas lado a lado.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Controle de Strides</h3>
              <p className="text-slate-400 leading-relaxed">
                Alterne entre <strong>C-Contiguous</strong> (Row-major) e <strong>F-Contiguous</strong> (Column-major) e veja como a performance é impactada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Deep Dive */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col md:flex-row">
          <div className="p-12 md:w-1/2 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-6">O que você vai aprender?</h3>
            <ul className="space-y-4">
              {[
                "Como o reshape funciona sem copiar dados (View vs Copy)",
                "Cálculo de endereços de memória: Base + Offset",
                "Impacto do dtype no consumo de memória",
                "Slicing em arrays multidimensionais"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-numpy-blue shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-950 md:w-1/2 p-12 border-l border-slate-800 font-mono text-sm relative">
             <div className="absolute top-4 right-4 text-slate-600 text-xs">example.py</div>
             <div className="space-y-2 text-slate-400">
               <p><span className="text-purple-400">import</span> numpy <span className="text-purple-400">as</span> np</p>
               <p className="text-slate-500"># Um array de 12 bytes</p>
               <p>a = np.arange(12, dtype=<span className="text-yellow-300">'int8'</span>)</p>
               <br/>
               <p className="text-slate-500"># Mudar a forma não muda os dados</p>
               <p>b = a.reshape((3, 4))</p>
               <br/>
               <p className="text-slate-500"># O segredo está nos strides</p>
               <p>print(b.strides) <span className="text-emerald-500"># (4, 1)</span></p>
             </div>
          </div>
        </div>
      </section>

      {/* Limitations / Disclaimer */}
      <section className="py-16 px-6 bg-amber-900/10 border-y border-amber-900/20">
        <div className="max-w-4xl mx-auto flex gap-6">
          <div className="shrink-0 text-amber-500">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-400 mb-2">Limitações do Simulador</h3>
            <p className="text-slate-400 text-sm mb-4">
              Para garantir uma experiência didática fluida no navegador, este software possui algumas restrições intencionais em comparação ao NumPy real:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-400">
              <div className="bg-slate-900/50 p-3 rounded border border-slate-800">
                <strong className="text-slate-300 block mb-1">Ambiente Simulado</strong>
                O código Python não roda em um kernel real, mas sim em uma engine JavaScript que emula o comportamento de memória do NumPy.
              </div>
              <div className="bg-slate-900/50 p-3 rounded border border-slate-800">
                <strong className="text-slate-300 block mb-1">Limite Visual</strong>
                Limitamos as dimensões (shape) a valores pequenos (ex: max 12) para evitar travamentos de renderização no DOM.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-24 text-center px-6">
        <h2 className="text-3xl font-bold text-white mb-8">Pronto para visualizar o invisível?</h2>
        <button 
          onClick={onStart}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-10 py-4 rounded-lg font-bold text-xl transition-all shadow-lg shadow-emerald-900/20"
        >
          Acessar Simulador Agora
        </button>
        <p className="mt-8 text-slate-600 text-sm">
          Feito com ❤️ para engenheiros de dados e cientistas.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;