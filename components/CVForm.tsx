
import React, { useState, useEffect } from 'react';
import { CVData, Experience, Education, LanguageSkill, FontType, CustomSection } from '../types';
import { Plus, Trash2, User, Book, Briefcase, Globe, Phone, Settings, AlignLeft, Type, Layers, PlusCircle } from 'lucide-react';

interface CVFormProps {
  data: CVData;
  onUpdate: (data: Partial<CVData>) => void;
}

const CVForm: React.FC<CVFormProps> = ({ data, onUpdate }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const names = (data.personalInfo.fullName || '').split(' ');
    if (names.length > 1) {
      const last = names.pop() || '';
      setLastName(last);
      setFirstName(names.join(' '));
    } else {
      setFirstName(data.personalInfo.fullName);
      setLastName('');
    }
  }, [data.personalInfo.fullName]);

  const handleNameChange = (first: string, last: string) => {
    setFirstName(first);
    setLastName(last);
    onUpdate({ personalInfo: { ...data.personalInfo, fullName: `${first} ${last}`.trim() } });
  };

  const addEducation = () => {
    const newEdu: Education = { id: crypto.randomUUID(), degree: '', institution: '', period: '' };
    onUpdate({ educations: [...data.educations, newEdu] });
  };

  const addExperience = () => {
    const newExp: Experience = { id: crypto.randomUUID(), role: '', company: '', period: '', description: '' };
    onUpdate({ experiences: [...data.experiences, newExp] });
  };

  const addLanguage = () => {
    const newLang: LanguageSkill = { 
      id: crypto.randomUUID(), 
      name: '', 
      speaking: 'Excelente', 
      writing: 'Excelente', 
      reading: 'Excelente', 
      comprehension: 'Excelente' 
    };
    onUpdate({ languageSkills: [...data.languageSkills, newLang] });
  };

  const removeLanguage = (id: string) => {
    if (data.languageSkills.length > 1) {
      onUpdate({ languageSkills: data.languageSkills.filter(l => l.id !== id) });
    }
  };

  const addCustomSection = () => {
    const newSection: CustomSection = { id: crypto.randomUUID(), title: '', content: '' };
    onUpdate({ customSections: [...(data.customSections || []), newSection] });
  };

  const updateEdu = (id: string, field: keyof Education, value: string) => {
    onUpdate({ educations: data.educations.map(e => e.id === id ? { ...e, [field]: value } : e) });
  };

  const updateExp = (id: string, field: keyof Experience, value: string) => {
    onUpdate({ experiences: data.experiences.map(e => e.id === id ? { ...e, [field]: value } : e) });
  };

  const updateCustomSection = (id: string, field: keyof CustomSection, value: string) => {
    onUpdate({ 
      customSections: data.customSections.map(s => s.id === id ? { ...s, [field]: value } : s) 
    });
  };

  const removeCustomSection = (id: string) => {
    onUpdate({ customSections: data.customSections.filter(s => s.id !== id) });
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Opções de Estilo */}
      <section className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-5 text-slate-800">
          <Settings size={20} />
          <h3 className="font-black text-xs uppercase tracking-widest">Estilo do PDF</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Fonte</label>
            <select value={data.styles.fontFamily} onChange={(e) => onUpdate({ styles: { ...data.styles, fontFamily: e.target.value as FontType } })} className="w-full border-2 border-white p-2.5 rounded-xl text-sm shadow-sm outline-none focus:border-blue-500">
              <option value={FontType.TIMES_NEW_ROMAN}>Times New Roman</option>
              <option value={FontType.ARIAL}>Arial</option>
              <option value={FontType.CALIBRI}>Calibri</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Espaçamento</label>
            <select value={data.styles.lineHeight} onChange={(e) => onUpdate({ styles: { ...data.styles, lineHeight: parseFloat(e.target.value) } })} className="w-full border-2 border-white p-2.5 rounded-xl text-sm shadow-sm outline-none focus:border-blue-500">
              <option value={1.2}>Compacto</option>
              <option value={1.5}>Normal</option>
              <option value={1.8}>Largo</option>
            </select>
          </div>
        </div>
      </section>

      {/* Identificação */}
      <section>
        <div className="flex items-center gap-2 mb-6 border-b-2 border-slate-100 pb-3">
          <User className="text-blue-600" size={22} />
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Identificação</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input placeholder="Apelido" value={lastName} onChange={(e) => handleNameChange(firstName, e.target.value)} className="border-2 border-slate-100 rounded-xl p-3 w-full outline-none focus:border-blue-500 bg-slate-50/50" />
          <input placeholder="Nome Próprio" value={firstName} onChange={(e) => handleNameChange(e.target.value, lastName)} className="border-2 border-slate-100 rounded-xl p-3 w-full outline-none focus:border-blue-500 bg-slate-50/50" />
          <input placeholder="Data de Nascimento" value={data.personalInfo.birthDate} onChange={(e) => onUpdate({ personalInfo: { ...data.personalInfo, birthDate: e.target.value } })} className="border-2 border-slate-100 rounded-xl p-3 w-full bg-slate-50/50" />
          <input placeholder="Naturalidade" value={data.personalInfo.naturality} onChange={(e) => onUpdate({ personalInfo: { ...data.personalInfo, naturality: e.target.value } })} className="border-2 border-slate-100 rounded-xl p-3 w-full bg-slate-50/50" />
          <input placeholder="Nacionalidade" value={data.personalInfo.nationality} onChange={(e) => onUpdate({ personalInfo: { ...data.personalInfo, nationality: e.target.value } })} className="border-2 border-slate-100 rounded-xl p-3 w-full bg-slate-50/50" />
          <input placeholder="Estado Civil" value={data.personalInfo.maritalStatus} onChange={(e) => onUpdate({ personalInfo: { ...data.personalInfo, maritalStatus: e.target.value } })} className="border-2 border-slate-100 rounded-xl p-3 w-full bg-slate-50/50" />
          <input placeholder="N° Bilhete Identidade" value={data.personalInfo.idNumber} onChange={(e) => onUpdate({ personalInfo: { ...data.personalInfo, idNumber: e.target.value } })} className="border-2 border-slate-100 rounded-xl p-3 w-full bg-slate-50/50" />
          <input placeholder="Residência" value={data.personalInfo.address} onChange={(e) => onUpdate({ personalInfo: { ...data.personalInfo, address: e.target.value } })} className="border-2 border-slate-100 rounded-xl p-3 w-full bg-slate-50/50" />
        </div>
      </section>

      {/* Formação Académica */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Book className="text-blue-600" size={22} />
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Formação Académica</h3>
          </div>
          <button onClick={addEducation} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Plus size={18} /></button>
        </div>
        <div className="space-y-4">
          {data.educations.map((edu) => (
            <div key={edu.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl relative group">
              <input placeholder="Período (Ex: 2010-2012)" value={edu.period} onChange={(e) => updateEdu(edu.id, 'period', e.target.value)} className="border border-slate-200 rounded-lg p-2 text-sm" />
              <input placeholder="Grau/Classe" value={edu.degree} onChange={(e) => updateEdu(edu.id, 'degree', e.target.value)} className="border border-slate-200 rounded-lg p-2 text-sm" />
              <input placeholder="Instituição/Escola" value={edu.institution} onChange={(e) => updateEdu(edu.id, 'institution', e.target.value)} className="border border-slate-200 rounded-lg p-2 text-sm" />
              <button onClick={() => onUpdate({ educations: data.educations.filter(e => e.id !== edu.id) })} className="absolute -right-2 -top-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"><Trash2 size={14}/></button>
            </div>
          ))}
        </div>
      </section>

      {/* Formação Profissional */}
      <section>
        <div className="flex items-center gap-2 mb-4 border-b-2 border-slate-100 pb-3">
          <Layers className="text-blue-600" size={22} />
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Formação Profissional</h3>
        </div>
        <textarea placeholder="Liste seus cursos e conhecimentos técnicos..." value={data.professionalTraining} onChange={(e) => onUpdate({ professionalTraining: e.target.value })} className="border-2 border-slate-100 rounded-xl p-4 w-full text-sm min-h-[100px] outline-none focus:border-blue-500 bg-slate-50/30" />
      </section>

      {/* Experiência Profissional */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="text-blue-600" size={22} />
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Experiência Profissional</h3>
          </div>
          <button onClick={addExperience} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Plus size={18} /></button>
        </div>
        <div className="space-y-4">
          {data.experiences.map((exp) => (
            <div key={exp.id} className="space-y-3 p-4 bg-slate-50 rounded-xl relative group">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input placeholder="Anos (Ex: 2015-2018)" value={exp.period} onChange={(e) => updateExp(exp.id, 'period', e.target.value)} className="border border-slate-200 rounded-lg p-2 text-sm" />
                <input placeholder="Cargo" value={exp.role} onChange={(e) => updateExp(exp.id, 'role', e.target.value)} className="border border-slate-200 rounded-lg p-2 text-sm" />
                <input placeholder="Empresa" value={exp.company} onChange={(e) => updateExp(exp.id, 'company', e.target.value)} className="border border-slate-200 rounded-lg p-2 text-sm" />
              </div>
              <textarea placeholder="Descrição das tarefas..." value={exp.description} onChange={(e) => updateExp(exp.id, 'description', e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-sm h-16" />
              <button onClick={() => onUpdate({ experiences: data.experiences.filter(e => e.id !== exp.id) })} className="absolute -right-2 -top-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"><Trash2 size={14}/></button>
            </div>
          ))}
        </div>
      </section>

      {/* Domínio Linguístico */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="text-blue-600" size={22} />
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Domínio Linguístico</h3>
          </div>
          <button onClick={addLanguage} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm">
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {data.languageSkills.map((lang, idx) => (
            <div key={lang.id} className="relative group p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="md:col-span-1">
                   <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Língua</label>
                   <input 
                    value={lang.name} 
                    onChange={(e) => {
                      const updated = [...data.languageSkills];
                      updated[idx].name = e.target.value;
                      onUpdate({ languageSkills: updated });
                    }} 
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none focus:border-blue-500" 
                    placeholder="Ex: Inglês" 
                  />
                </div>
                {['speaking', 'writing', 'reading', 'comprehension'].map((field) => (
                  <div key={field}>
                    <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">
                      {field === 'speaking' ? 'Fala' : field === 'writing' ? 'Escrita' : field === 'reading' ? 'Leitura' : 'Compr.'}
                    </label>
                    <select value={(lang as any)[field]} onChange={(e) => {
                      const updated = [...data.languageSkills];
                      (updated[idx] as any)[field] = e.target.value;
                      onUpdate({ languageSkills: updated });
                    }} className="w-full border border-slate-200 rounded-lg p-2 text-[10px] outline-none focus:border-blue-500">
                      <option value="Excelente">Excelente</option>
                      <option value="Bom">Bom</option>
                      <option value="Razoável">Razoável</option>
                      <option value="Básico">Básico</option>
                    </select>
                  </div>
                ))}
              </div>
              {data.languageSkills.length > 1 && (
                <button 
                  onClick={() => removeLanguage(lang.id)} 
                  className="absolute -right-2 -top-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-red-600 hover:text-white"
                >
                  <Trash2 size={12}/>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Perfil Pessoal */}
      <section>
        <div className="flex items-center gap-2 mb-4 border-b-2 border-slate-100 pb-3">
          <AlignLeft className="text-blue-600" size={22} />
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Perfil Pessoal (Competências)</h3>
        </div>
        <textarea placeholder="Ex: Capacidade de trabalhar sob pressão&#10;Excelente comunicação oral e escrita" value={data.personalProfile} onChange={(e) => onUpdate({ personalProfile: e.target.value })} className="border-2 border-slate-100 rounded-xl p-4 w-full text-sm min-h-[120px] outline-none focus:border-blue-500 bg-slate-50/30" />
      </section>

      {/* Categorias Personalizadas */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="text-blue-600" size={22} />
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Mais Categorias</h3>
          </div>
          <button onClick={addCustomSection} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm">
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-6">
          {data.customSections?.map((section) => (
            <div key={section.id} className="p-5 bg-slate-50 rounded-2xl relative group border border-slate-200">
              <input 
                placeholder="Título da Categoria (Ex: Referências, Projetos...)" 
                value={section.title} 
                onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)} 
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold mb-3 outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <textarea 
                placeholder="Conteúdo desta categoria..." 
                value={section.content} 
                onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)} 
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <button 
                onClick={() => removeCustomSection(section.id)} 
                className="absolute -right-2 -top-2 bg-red-100 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-600 hover:text-white"
              >
                <Trash2 size={16}/>
              </button>
            </div>
          ))}
          {(!data.customSections || data.customSections.length === 0) && (
            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-medium">
              Nenhuma categoria personalizada adicionada.
            </div>
          )}
        </div>
      </section>

      {/* Contactos */}
      <section className="bg-blue-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-200">
        <div className="flex items-center gap-2 mb-6 border-b border-blue-400/30 pb-3">
          <Phone size={22} />
          <h3 className="font-black uppercase text-xs tracking-widest">Contactos do Currículo</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-blue-200 uppercase ml-1">Telemóvel</label>
            <input placeholder="+258..." value={data.personalInfo.phone} onChange={(e) => onUpdate({ personalInfo: { ...data.personalInfo, phone: e.target.value } })} className="bg-blue-800/50 border border-blue-400/30 rounded-xl p-3 w-full outline-none placeholder:text-blue-300" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-blue-200 uppercase ml-1">Email</label>
            <input placeholder="exemplo@gmail.com" value={data.personalInfo.email} onChange={(e) => onUpdate({ personalInfo: { ...data.personalInfo, email: e.target.value } })} className="bg-blue-800/50 border border-blue-400/30 rounded-xl p-3 w-full outline-none placeholder:text-blue-300" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CVForm;
