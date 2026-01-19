
import React from 'react';
import { CVData, CVModel } from '../types';

interface CVPreviewProps {
  data: CVData;
  isExport?: boolean;
}

const CVPreview: React.FC<CVPreviewProps> = ({ data, isExport = false }) => {
  if (!data) return null;
  
  const { personalInfo, experiences, educations, languageSkills, professionalTraining, personalProfile, styles, customSections } = data;
  const currentModel = styles?.model || CVModel.CLASSIC;

  // Estilos Condicionais baseados no Modelo
  const getSectionTitleStyle = (): React.CSSProperties => {
    // Estilo Base
    const base: React.CSSProperties = {
      fontSize: '12pt',
      fontWeight: 'bold',
      marginTop: '16pt',
      textTransform: 'uppercase',
      display: 'inline-block', 
      width: 'auto', 
      lineHeight: '1.2',
      color: '#000',
      paddingBottom: '2pt', 
      marginBottom: '8pt'
    };

    if (currentModel === CVModel.EXECUTIVE) {
      return {
        ...base,
        // Executivo é a exceção: precisa ser um bloco cheio centralizado
        display: 'block',
        width: '100%',
        textAlign: 'center',
        border: '1pt solid black',
        padding: '6pt 12pt',
        backgroundColor: '#f8f8f8',
        borderRadius: '2pt',
        marginBottom: '12pt',
        marginTop: '20pt',
        letterSpacing: '1pt'
      };
    }

    if (currentModel === CVModel.MINIMALIST) {
      return {
        ...base,
        borderBottom: '0.5pt solid #999', // Sublinhado fixo para Minimalista
        marginBottom: '8pt',
        marginTop: '12pt',
        fontSize: '11pt',
        paddingBottom: '2pt'
      };
    }

    if (currentModel === CVModel.ELEGANT) {
      return { 
        ...base, 
        borderBottom: '0.5pt solid #444', // Sublinhado fixo para Elegante
        textTransform: 'none', 
        fontSize: '14pt',
        paddingBottom: '3pt'
      };
    }

    // Para Clean, Moderno e Clássico (Sublinhado removido conforme solicitado)
    const commonStyle = { 
      ...base, 
      borderBottom: 'none',
      paddingBottom: '2pt'
    };

    if (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN) {
      return { ...commonStyle, paddingBottom: '2pt', marginBottom: '6pt' };
    }

    return commonStyle;
  };

  const textStyle: React.CSSProperties = {
    fontSize: styles?.fontSize || '11pt',
    lineHeight: styles?.lineHeight || 1.4,
    color: '#000',
    fontFamily: styles?.fontFamily || 'serif',
    width: '100%',
    minHeight: '257mm' // Mínimo de uma página A4 (contando padding)
  };

  const names = (personalInfo?.fullName || '').trim().split(' ');
  const lastName = names.length > 1 ? names.pop() : '';
  const firstName = names.join(' ');

  const renderTitle = (num: number, text: string) => {
    const style = getSectionTitleStyle();
    
    // Tratamento especial para o modelo Executive que DEVE ser um bloco cheio
    if (currentModel === CVModel.EXECUTIVE) {
        return <div className="section-title" style={style}>{text}</div>;
    }

    // Para os outros modelos:
    // Separamos o wrapper (bloco) do texto (inline-block) para garantir que 
    // o sublinhado (border-bottom) fique APENAS no tamanho do texto.
    
    const wrapperStyle: React.CSSProperties = {
       marginTop: style.marginTop,
       marginBottom: style.marginBottom,
       textAlign: (style.textAlign as any) || 'left',
       display: 'block', // Garante que ocupa a linha e empurra o conteúdo
       width: '100%'
    };

    // Removemos margens do estilo interno para evitar duplicação
    // E garantimos display: inline-block para a borda abraçar o texto
    const innerStyle: React.CSSProperties = {
       ...style,
       marginTop: 0,
       marginBottom: 0,
       display: 'inline-block', // CRÍTICO: Faz o elemento ter apenas a largura do texto
       width: 'auto'
    };

    const content = (currentModel === CVModel.MODERN || currentModel === CVModel.MINIMALIST) 
      ? text 
      : `${num}. ${text}`;

    return (
      <div style={wrapperStyle}>
        <span className="section-title" style={innerStyle}>{content}</span>
      </div>
    );
  };

  return (
    <div style={textStyle}>
      {/* Cabeçalho */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.MINIMALIST) ? '20pt' : '35pt', 
        borderBottom: 'none',
        paddingBottom: '12pt' 
      }}>
        <h1 style={{ 
          fontSize: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.MINIMALIST) ? '18pt' : '22pt', 
          fontWeight: 'bold', 
          textTransform: 'uppercase', 
          letterSpacing: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? '3pt' : '1pt', 
          margin: '0',
          display: 'inline-block',
          borderBottom: 'none',
          paddingBottom: '2pt'
        }}>
          CURRICULUM VITAE
        </h1>
      </div>

      {/* 1. Dados Pessoais */}
      <section>
        {renderTitle(1, "Dados pessoais")}
        {currentModel === CVModel.MINIMALIST ? (
           <div style={{ marginTop: '5pt', fontSize: '10pt' }}>
             <p><strong>Nome:</strong> {firstName} {lastName}</p>
             <p><strong>Nascimento:</strong> {personalInfo?.birthDate}</p>
             <p><strong>Nacionalidade:</strong> {personalInfo?.nationality}</p>
             <p><strong>Estado Civil:</strong> {personalInfo?.maritalStatus}</p>
             <p><strong>Residência:</strong> {personalInfo?.address}</p>
           </div>
        ) : (
          <table style={{ 
            width: '100%', 
            border: 'none', 
            borderCollapse: 'collapse', 
            marginTop: '5pt',
            marginLeft: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? '0' : '10pt'
          }}>
            <tbody>
              <tr>
                <td style={{ width: '180pt', fontWeight: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? 'normal' : 'bold', padding: '3pt 0', color: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? '#666' : '#000' }}>Apelido</td>
                <td style={{ width: '15pt' }}>:</td>
                <td style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{lastName || '---'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? 'normal' : 'bold', padding: '3pt 0', color: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? '#666' : '#000' }}>Nome</td>
                <td>:</td>
                <td style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{firstName || '---'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? 'normal' : 'bold', padding: '3pt 0', color: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? '#666' : '#000' }}>Data de Nascimento</td>
                <td>:</td>
                <td>{personalInfo?.birthDate || '---'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? 'normal' : 'bold', padding: '3pt 0', color: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? '#666' : '#000' }}>Naturalidade</td>
                <td>:</td>
                <td>{personalInfo?.naturality || '---'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? 'normal' : 'bold', padding: '3pt 0', color: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? '#666' : '#000' }}>Nacionalidade</td>
                <td>:</td>
                <td>{personalInfo?.nationality || '---'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? 'normal' : 'bold', padding: '3pt 0', color: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? '#666' : '#000' }}>Estado Civil</td>
                <td>:</td>
                <td>{personalInfo?.maritalStatus || '---'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? 'normal' : 'bold', padding: '3pt 0', color: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? '#666' : '#000' }}>Bilhete de Identidade n°</td>
                <td>:</td>
                <td>{personalInfo?.idNumber || '---'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? 'normal' : 'bold', padding: '3pt 0', color: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.EXECUTIVE) ? '#666' : '#000' }}>Residência</td>
                <td>:</td>
                <td>{personalInfo?.address || '---'}</td>
              </tr>
            </tbody>
          </table>
        )}
      </section>

      {/* 2. Formação Académica */}
      <section>
        {renderTitle(2, "Formação Académica")}
        <div style={{ marginTop: '5pt' }}>
          {educations?.length > 0 ? educations.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '6pt', position: 'relative', paddingLeft: styles.primaryBullet !== 'none' ? '20pt' : '5pt' }}>
              {styles.primaryBullet !== 'none' && (
                <span style={{ position: 'absolute', left: 0, fontWeight: 'bold' }}>{styles.primaryBullet}</span>
              )}
              <span style={{ fontWeight: 'bold' }}>{edu.period}</span> – {edu.degree} na {edu.institution}
            </div>
          )) : !isExport && <p style={{ color: '#aaa', fontStyle: 'italic' }}>[Sem formação académica]</p>}
        </div>
      </section>

      {/* 3. Formação Profissional */}
      <section>
        {renderTitle(3, "Formação Profissional")}
        <div style={{ marginTop: '5pt' }}>
          {professionalTraining ? (
            <div style={{ position: 'relative', paddingLeft: styles.primaryBullet !== 'none' ? '20pt' : '5pt', whiteSpace: 'pre-wrap' }}>
              {styles.primaryBullet !== 'none' && (
                <span style={{ position: 'absolute', left: 0, fontWeight: 'bold' }}>{styles.primaryBullet}</span>
              )}
              {professionalTraining}
            </div>
          ) : !isExport && <p style={{ color: '#aaa', fontStyle: 'italic' }}>[Sem formação profissional]</p>}
        </div>
      </section>

      {/* 4. Experiência Profissional */}
      <section>
        {renderTitle(4, "Experiência Profissional")}
        <div style={{ marginTop: '5pt' }}>
          {experiences?.length > 0 ? experiences.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '10pt', position: 'relative', paddingLeft: styles.primaryBullet !== 'none' ? '20pt' : '5pt' }}>
              {styles.primaryBullet !== 'none' && (
                <span style={{ position: 'absolute', left: 0, fontWeight: 'bold' }}>{styles.primaryBullet}</span>
              )}
              <span style={{ fontWeight: 'bold' }}>{exp.period}</span> – {exp.role} na {exp.company}. {exp.description}
            </div>
          )) : !isExport && <p style={{ color: '#aaa', fontStyle: 'italic' }}>[Sem experiência profissional]</p>}
        </div>
      </section>

      {/* 5. Domínio Linguístico */}
      <section>
        {renderTitle(5, "Domínio Linguístico")}
        <div style={{ marginTop: '10pt' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            border: '1pt solid black' 
          }}>
            <thead>
              <tr style={{ backgroundColor: '#eeeeee' }}>
                <th style={{ border: '1pt solid black', padding: '6pt', textAlign: 'left', fontWeight: 'bold', fontSize: '10pt' }}>Língua</th>
                <th style={{ border: '1pt solid black', padding: '6pt', textAlign: 'center', fontWeight: 'bold', fontSize: '10pt' }}>Fala</th>
                <th style={{ border: '1pt solid black', padding: '6pt', textAlign: 'center', fontWeight: 'bold', fontSize: '10pt' }}>Escrita</th>
                <th style={{ border: '1pt solid black', padding: '6pt', textAlign: 'center', fontWeight: 'bold', fontSize: '10pt' }}>Leitura</th>
                <th style={{ border: '1pt solid black', padding: '6pt', textAlign: 'center', fontWeight: 'bold', fontSize: '10pt' }}>Compreensão</th>
              </tr>
            </thead>
            <tbody>
              {languageSkills?.map((lang) => (
                <tr key={lang.id}>
                  <td style={{ border: '1pt solid black', padding: '6pt', fontWeight: 'bold' }}>{lang.name}</td>
                  <td style={{ border: '1pt solid black', padding: '6pt', textAlign: 'center' }}>{lang.speaking}</td>
                  <td style={{ border: '1pt solid black', padding: '6pt', textAlign: 'center' }}>{lang.writing}</td>
                  <td style={{ border: '1pt solid black', padding: '6pt', textAlign: 'center' }}>{lang.reading}</td>
                  <td style={{ border: '1pt solid black', padding: '6pt', textAlign: 'center' }}>{lang.comprehension}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Perfil Pessoal */}
      <section>
        {renderTitle(6, "Perfil Pessoal")}
        <div style={{ marginTop: '5pt' }}>
          {personalProfile ? personalProfile.split('\n').filter(l => l.trim()).map((line, i) => (
            <div key={i} style={{ marginBottom: '5pt', paddingLeft: styles.secondaryBullet !== 'none' ? '20pt' : '5pt', position: 'relative' }}>
              {styles.secondaryBullet !== 'none' && (
                <span style={{ position: 'absolute', left: 0 }}>{styles.secondaryBullet}</span>
              )}
              {line}
            </div>
          )) : !isExport && <p style={{ color: '#aaa', fontStyle: 'italic' }}>[Sem perfil pessoal]</p>}
        </div>
      </section>

      {/* Categorias Customizadas */}
      {customSections && customSections.map((section, idx) => (
        <section key={section.id}>
          {renderTitle(7 + idx, section.title || 'Informações Adicionais')}
          <div style={{ marginTop: '5pt' }}>
            {section.content ? section.content.split('\n').filter(l => l.trim()).map((line, i) => (
              <div key={i} style={{ marginBottom: '5pt', paddingLeft: styles.primaryBullet !== 'none' ? '20pt' : '5pt', position: 'relative' }}>
                {styles.primaryBullet !== 'none' && (
                  <span style={{ position: 'absolute', left: 0 }}>{styles.primaryBullet}</span>
                )}
                {line}
              </div>
            )) : !isExport && <p style={{ color: '#aaa', fontStyle: 'italic' }}>[Conteúdo]</p>}
          </div>
        </section>
      ))}

      {/* Contactos */}
      <div style={{ 
        marginTop: '40pt', 
        borderTop: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.MINIMALIST) ? '1pt solid #eee' : '2pt solid black', 
        paddingTop: '12pt' 
      }}>
        <p className="section-title" style={{ 
          margin: '0 0 10pt 0', 
          fontWeight: 'bold', 
          // Ajustes específicos para consistência com o modelo
          borderBottom: 'none', // Sublinhado removido universalmente conforme feedback
          display: 'inline-block', 
          fontSize: (currentModel === CVModel.ELEGANT) ? '14pt' : (currentModel === CVModel.MINIMALIST ? '11pt' : '12pt'),
          textTransform: (currentModel === CVModel.ELEGANT) ? 'none' : 'uppercase'
        }}>
          Contactos:
        </p>
        <div style={{ marginLeft: (currentModel === CVModel.CLEAN || currentModel === CVModel.MODERN || currentModel === CVModel.MINIMALIST) ? '0' : '12pt', marginTop: '10pt' }}>
          <p style={{ margin: '4pt 0' }}>
            <strong>Telemóvel:</strong> {personalInfo?.phone || '---'}
          </p>
          <p style={{ margin: '4pt 0' }}>
            <strong>Email:</strong> {personalInfo?.email || '---'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
