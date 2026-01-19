
import React, { useState, useEffect } from 'react';
import { Country, FontType, CVData, BulletChar, CVModel } from './types';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import { FileText, Loader2, Download, Settings2, Plus, Minus, Ban, Layout, Timer, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const initialData: CVData = {
  country: Country.MOZAMBIQUE,
  styles: {
    model: CVModel.CLASSIC,
    fontFamily: FontType.TIMES_NEW_ROMAN,
    fontSize: '11pt',
    underlineSections: false,
    lineHeight: 1.5,
    primaryBullet: '•',
    secondaryBullet: '•'
  },
  personalInfo: {
    fullName: '',
    birthDate: '',
    nationality: 'Moçambicana',
    maritalStatus: 'Solteiro(a)',
    address: '',
    phone: '',
    email: '',
    idNumber: '',
    naturality: ''
  },
  educations: [],
  professionalTraining: '',
  experiences: [],
  languageSkills: [
    { id: '1', name: 'Português', speaking: 'Excelente', writing: 'Excelente', reading: 'Excelente', comprehension: 'Excelente' }
  ],
  personalProfile: '',
  customSections: []
};

const App: React.FC = () => {
  const [cvData, setCvData] = useState<CVData>(initialData);
  const [isExporting, setIsExporting] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);

  // Estados do Modal de Pagamento
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTimeLeft, setPaymentTimeLeft] = useState(70);
  const [paymentInput, setPaymentInput] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'expired' | 'error'>('idle');

  // Lógica do Temporizador
  useEffect(() => {
    let interval: number;
    if (showPaymentModal && paymentTimeLeft > 0 && paymentStatus === 'idle') {
      interval = window.setInterval(() => {
        setPaymentTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (paymentTimeLeft === 0 && paymentStatus === 'idle') {
      setPaymentStatus('expired');
    }
    return () => clearInterval(interval);
  }, [showPaymentModal, paymentTimeLeft, paymentStatus]);

  const handleUpdate = (data: Partial<CVData>) => {
    setCvData(prev => ({ ...prev, ...data }));
  };

  const updateFontSize = (delta: number) => {
    const sizes: CVData['styles']['fontSize'][] = ['10pt', '11pt', '12pt', '14pt', '16pt', '18pt', '20pt'];
    const currentIndex = sizes.indexOf(cvData.styles.fontSize);
    const nextIndex = Math.max(0, Math.min(sizes.length - 1, currentIndex + delta));
    handleUpdate({ styles: { ...cvData.styles, fontSize: sizes[nextIndex] } });
  };

  const handleModelChange = (model: CVModel) => {
    const updates: Partial<CVData['styles']> = { model };
    
    // Removida a lógica que forçava o sublinhado a desaparecer (underlineSections = false).
    // Agora apenas ajusta a fonte sugerida, mas respeita a configuração de sublinhado do usuário.
    if (model === CVModel.CLEAN || model === CVModel.MODERN || model === CVModel.MINIMALIST) {
      updates.fontFamily = FontType.ARIAL;
    } else {
      updates.fontFamily = FontType.TIMES_NEW_ROMAN;
    }
    
    handleUpdate({ styles: { ...cvData.styles, ...updates } });
  };

  // Abre o modal em vez de exportar direto
  const initiateExport = () => {
    setShowPaymentModal(true);
    setPaymentTimeLeft(70);
    setPaymentStatus('idle');
    setPaymentInput('');
    setShowFabMenu(false);
  };

  const handleVerifyPayment = () => {
    if (paymentStatus === 'expired') return;

    const normalizedText = paymentInput.toLowerCase().trim();
    
    // VALIDAÇÃO RIGOROSA:
    // 1. Verifica se tem a palavra chave de sucesso "Confirmado" ou "Transferido"
    const hasSuccessKeyword = normalizedText.includes('confirmado') || normalizedText.includes('transferido');

    // 2. Verifica se tem o nome COMPLETO da beneficiária (com ou sem acentos para garantir)
    const hasCorrectName = normalizedText.includes('deolinda joão rafael avijala') || 
                           normalizedText.includes('deolinda joao rafael avijala');
    
    // 3. Verifica se tem o número exato
    const hasCorrectNumber = normalizedText.includes('863734977');

    // SÓ ACEITA SE TODAS AS 3 CONDIÇÕES FOREM VERDADEIRAS
    if (hasSuccessKeyword && hasCorrectName && hasCorrectNumber) {
      setPaymentStatus('success');
      // Aguarda 1.5s para mostrar o sucesso e depois baixa
      setTimeout(() => {
        handleExportPDF();
        setShowPaymentModal(false);
      }, 1500);
    } else {
      setPaymentStatus('error');
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('cv-export-container');
    if (!element || isExporting) return;
    
    setIsExporting(true);
    
    try {
      // Pequeno delay para garantir renderização das fontes
      await new Promise(resolve => setTimeout(resolve, 800));

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Captura o canvas de todo o conteúdo
      // AUMENTAMOS O SCALE PARA 3: Isso cria uma imagem de ultra-alta resolução (como um print 4K)
      // evitando que linhas finas fiquem borradas ou grossas demais.
      const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        imageTimeout: 15000
      });

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Proporção para manter no A4
      const ratio = pdfWidth / (imgWidth / 3); // Ajustado pelo scale 3
      const canvasPageHeight = (pdfHeight / ratio) * 3; // Altura de uma página PDF no canvas
      
      let heightLeft = imgHeight;
      let position = 0;

      // Primeira página
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = imgWidth;
      pageCanvas.height = Math.min(imgHeight, canvasPageHeight);
      const ctx = pageCanvas.getContext('2d');
      
      // Melhoria na qualidade do desenho
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(canvas, 0, 0, imgWidth, pageCanvas.height, 0, 0, imgWidth, pageCanvas.height);
      }
      
      pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pdfWidth, (pageCanvas.height * ratio) / 3);
      
      heightLeft -= canvasPageHeight;
      position -= canvasPageHeight;

      // Páginas subsequentes (loop para 30+ páginas)
      while (heightLeft > 0) {
        pdf.addPage();
        const nextStepHeight = Math.min(heightLeft, canvasPageHeight);
        
        const pCanvas = document.createElement('canvas');
        pCanvas.width = imgWidth;
        pCanvas.height = nextStepHeight;
        const pCtx = pCanvas.getContext('2d');
        
        if (pCtx) {
          pCtx.imageSmoothingEnabled = true;
          pCtx.imageSmoothingQuality = 'high';
          // "Recorta" a próxima parte do canvas principal
          pCtx.drawImage(canvas, 0, Math.abs(position), imgWidth, nextStepHeight, 0, 0, imgWidth, nextStepHeight);
        }
        
        pdf.addImage(pCanvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pdfWidth, (nextStepHeight * ratio) / 3);
        
        heightLeft -= canvasPageHeight;
        position -= canvasPageHeight;
      }
      
      const fileName = cvData.personalInfo.fullName 
        ? `CV_${cvData.personalInfo.fullName.trim().replace(/\s+/g, '_')}.pdf` 
        : 'Curriculum_Vitae.pdf';
        
      pdf.save(fileName);
    } catch (error) {
      console.error("Erro na exportação:", error);
      alert("Erro ao gerar PDF de grande volume. Tente reduzir o conteúdo ou simplificar as imagens.");
    } finally {
      setIsExporting(false);
    }
  };

  const allBullets: BulletChar[] = ['•', '♦', '■', '◉', '▪', '◆', '⇨', '—', '◦', '➢', '►', '☑', '▶', '✓', '➤', '★', '·'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-200 font-sans selection:bg-blue-100">
      <header className="bg-white border-b border-slate-300 sticky top-0 z-50 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-700 p-1.5 rounded-lg">
              <FileText className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-slate-800 text-lg tracking-tighter uppercase">MOZ CV ARCHITECT</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={initiateExport} 
              disabled={isExporting} 
              className="bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-blue-800 shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              <span>{isExporting ? 'PROCESSANDO PÁGINAS...' : 'GERAR PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal de Pagamento / Confirmação */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Cabeçalho do Modal */}
            <div className={`p-6 text-center ${paymentStatus === 'expired' ? 'bg-red-50' : paymentStatus === 'success' ? 'bg-green-50' : 'bg-blue-50'}`}>
              {paymentStatus === 'success' ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="text-green-600 w-12 h-12 mb-2" />
                  <h2 className="text-xl font-black text-green-700">Confirmado!</h2>
                  <p className="text-green-600 text-sm">A iniciar download...</p>
                </div>
              ) : paymentStatus === 'expired' ? (
                <div className="flex flex-col items-center gap-2">
                  <XCircle className="text-red-600 w-12 h-12 mb-2" />
                  <h2 className="text-xl font-black text-red-700">Tempo Expirado</h2>
                  <p className="text-red-600 text-sm">Não confirmou dentro de 70s.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                     <Timer className={`w-12 h-12 mb-2 transition-colors ${paymentTimeLeft < 20 ? 'text-red-600 animate-pulse' : 'text-blue-700'}`} />
                     <span className="absolute -top-1 -right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                       {paymentTimeLeft}s
                     </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Confirmação Pendente</h2>
                  <p className="text-slate-500 text-xs px-4">
                    Cole a SMS de transferência de <strong>1MT</strong> para <strong>863734977</strong> (Deolinda João Rafael Avijala) ou SIMO.
                  </p>
                </div>
              )}
            </div>

            {/* Corpo do Modal */}
            <div className="p-6 space-y-4">
              {paymentStatus !== 'success' && paymentStatus !== 'expired' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Cole a mensagem aqui:</label>
                    <textarea 
                      value={paymentInput}
                      onChange={(e) => {
                        setPaymentInput(e.target.value);
                        if (paymentStatus === 'error') setPaymentStatus('idle');
                      }}
                      placeholder="Ex: Confirmado. Voce transferiu 1MT para 863734977..."
                      className={`w-full h-32 p-3 rounded-xl border-2 text-sm outline-none resize-none transition-all ${paymentStatus === 'error' ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:border-blue-500'}`}
                    />
                    {paymentStatus === 'error' && (
                      <p className="text-red-500 text-xs font-bold flex items-center gap-1">
                        <AlertCircle size={12} /> Mensagem inválida. Copie a SMS completa.
                      </p>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleVerifyPayment}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3.5 rounded-xl font-black uppercase text-sm shadow-lg active:scale-95 transition-all"
                  >
                    Confirmar Transferência
                  </button>
                </>
              )}

              {paymentStatus === 'expired' && (
                <button 
                  onClick={initiateExport}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3.5 rounded-xl font-black uppercase text-sm shadow-lg active:scale-95 transition-all"
                >
                  Tentar Novamente
                </button>
              )}
              
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="w-full text-slate-400 text-xs font-bold uppercase hover:text-slate-600 py-2"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative bg-slate-200">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100 no-print">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-10 mb-20">
            <CVForm data={cvData} onUpdate={handleUpdate} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex justify-center items-start bg-slate-300/50">
          <div className="shadow-2xl my-4 bg-white scale-[0.4] sm:scale-[0.6] lg:scale-[0.7] xl:scale-[0.85] origin-top">
             <div className="bg-white w-[210mm] min-h-[297mm] p-[20mm]">
                <CVPreview data={cvData} isExport={false} />
             </div>
          </div>
        </div>
      </main>

      {/* Container Oculto para Exportação - Permite altura infinita sem restrição de A4 para o canvas inicial */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div 
          id="cv-export-container" 
          style={{ 
            width: '210mm', 
            backgroundColor: 'white', 
            padding: '20mm',
            boxSizing: 'border-box'
          }}
        >
          <CVPreview data={cvData} isExport={true} />
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 no-print">
        {showFabMenu && (
          <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl mb-2 flex flex-col gap-6 w-[320px] max-h-[75vh] overflow-y-auto border border-slate-200">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2"><Layout size={12}/> Escolher Modelo</p>
              <div className="grid grid-cols-1 gap-2">
                {[CVModel.CLASSIC, CVModel.CLEAN, CVModel.ELEGANT, CVModel.MODERN, CVModel.EXECUTIVE, CVModel.MINIMALIST].map((m) => (
                  <button 
                    key={m}
                    onClick={() => handleModelChange(m)}
                    className={`w-full py-3 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${cvData.styles.model === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-200'}`}
                  >
                    {m === CVModel.CLASSIC ? 'Clássico' : 
                     m === CVModel.CLEAN ? 'Limpo' : 
                     m === CVModel.ELEGANT ? 'Premium' :
                     m === CVModel.MODERN ? 'Sem Números' :
                     m === CVModel.EXECUTIVE ? 'Executivo (Centralizado)' :
                     'Minimalista'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Tamanho do Texto</p>
              <div className="flex items-center justify-between bg-slate-100 rounded-2xl p-1.5">
                <button onClick={() => updateFontSize(-1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-slate-50 transition-colors"><Minus size={18}/></button>
                <span className="font-black text-slate-800">{cvData.styles.fontSize}</span>
                <button onClick={() => updateFontSize(1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-slate-50 transition-colors"><Plus size={18}/></button>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Marcadores</p>
              <button 
                onClick={() => handleUpdate({ styles: { ...cvData.styles, primaryBullet: 'none', secondaryBullet: 'none' } })}
                className={`w-full mb-3 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black border-2 transition-all ${cvData.styles.primaryBullet === 'none' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
              >
                <Ban size={14} /> SEM MARCADORES
              </button>
              <div className="grid grid-cols-4 gap-2">
                {allBullets.map((b) => (
                  <button 
                    key={b}
                    onClick={() => handleUpdate({ styles: { ...cvData.styles, primaryBullet: b, secondaryBullet: b } })}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all border-2 ${cvData.styles.primaryBullet === b ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-slate-50 text-slate-400 border-transparent hover:border-blue-200'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <button 
          onClick={() => setShowFabMenu(!showFabMenu)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all transform ${showFabMenu ? 'bg-slate-900 rotate-90' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <Settings2 className="text-white" size={28} />
        </button>
      </div>
    </div>
  );
};

export default App;
