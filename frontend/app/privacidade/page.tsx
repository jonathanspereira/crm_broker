'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="outline" className="mb-6">
              ← Voltar
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Política de Privacidade
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Última atualização: 14 de fevereiro de 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Introdução */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              1. Introdução
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Bem-vindo à plataforma CRM Broker. Sua privacidade é importante para nós. Esta Política de Privacidade 
              explica como coletamos, usamos, divulgamos e protegemos suas informações quando você utiliza nossos serviços.
            </p>
          </section>

          {/* Coleta de Informações */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              2. Coleta de Informações
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Informações que você nos fornece
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Coletamos informações que você fornece voluntariamente, como:
                </p>
                <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mt-2 space-y-1">
                  <li>Nome completo e informações de contato</li>
                  <li>Endereço de email e telefone</li>
                  <li>Informações sobre propriedades e imóveis</li>
                  <li>Dados de simulações e cálculos financeiros</li>
                  <li>Histórico de documentos criados</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Informações coletadas automaticamente
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Quando você usa nossa plataforma, podemos coletar:
                </p>
                <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mt-2 space-y-1">
                  <li>Dados de uso da aplicação (cliques, navegação, tempo de sessão)</li>
                  <li>Informações do dispositivo (tipo, sistema operacional, navegador)</li>
                  <li>Endereço IP e localização aproximada</li>
                  <li>Cookies e tecnologias de rastreamento similares</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Uso de Informações */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              3. Uso de Informações
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Utilizamos as informações coletadas para:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Processar transações e enviar confirmações</li>
              <li>Responder às suas solicitações e perguntas</li>
              <li>Enviar atualizações e notificações sobre sua conta</li>
              <li>Análise de dados para otimizar a experiência do usuário</li>
              <li>Cumprimento de obrigações legais</li>
              <li>Proteção contra fraude e atividades ilícitas</li>
            </ul>
          </section>

          {/* Compartilhamento de Informações */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              4. Compartilhamento de Informações
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Não vendemos ou alugamos suas informações pessoais. Compartilhamos dados apenas quando necessário:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mt-4 space-y-2">
              <li>Com prestadores de serviços que nos auxiliam (hospedagem, analytics)</li>
              <li>Quando exigido por lei ou regulamentação</li>
              <li>Para proteger nossos direitos legais</li>
              <li>Com seu consentimento explícito</li>
              <li>Em caso de fusão, aquisição ou venda de ativos</li>
            </ul>
          </section>

          {/* Segurança */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              5. Segurança de Dados
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Implementamos medidas de segurança técnicas, administrativas e físicas para proteger suas informações:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mt-4 space-y-2">
              <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
              <li>Armazenamento seguro em servidores protegidos</li>
              <li>Controle de acesso com autenticação</li>
              <li>Monitoramento de atividades suspeitas</li>
              <li>Atualizações regulares de segurança</li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
              Porém, nenhum sistema é completamente seguro. Se você descobrir uma vulnerabilidade, 
              entre em contato conosco imediatamente.
            </p>
          </section>

          {/* Retenção de Dados */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              6. Retenção de Dados
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Retemos suas informações pessoais pelo tempo necessário para fornecer nossos serviços 
              e cumprir obrigações legais. Você pode solicitar a exclusão de seus dados a qualquer momento, 
              sujeito a requisitos legais e comerciais.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              7. Cookies e Tecnologias Similares
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Utilizamos cookies e tecnologias similares para:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mt-4 space-y-2">
              <li>Manter você conectado à sua conta</li>
              <li>Lembrar suas preferências</li>
              <li>Entender como você usa nossos serviços</li>
              <li>Melhorar a experiência do usuário</li>
              <li>Personalizar conteúdo e publicidade</li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
              Você pode controlar cookies através das configurações do seu navegador.
            </p>
          </section>

          {/* Seus Direitos */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              8. Seus Direitos
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Você tem direito a:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir informações inexatas</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Portabilidade de dados</li>
              <li>Opor-se ao processamento de seus dados</li>
              <li>Retirar consentimento a qualquer momento</li>
              <li>Apresentar reclamação a autoridades de proteção de dados</li>
            </ul>
          </section>

          {/* Links Externos */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              9. Links Externos
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Nossa plataforma pode conter links para sites de terceiros. Não somos responsáveis pelas 
              políticas de privacidade desses sites externos. Recomendamos que você revise suas políticas 
              antes de fornecer informações pessoais.
            </p>
          </section>

          {/* Privacidade de Menores */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              10. Privacidade de Menores
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente 
              informações de menores. Se descobrirmos que coletamos dados de um menor, excluiremos 
              essas informações imediatamente.
            </p>
          </section>

          {/* Alterações na Política */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              11. Alterações nesta Política
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você de 
              mudanças significativas por email ou através de um aviso prominente em nossa plataforma. 
              Sua continuidade de uso após as mudanças constitui aceitação da política revisada.
            </p>
          </section>

          {/* Contato */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              12. Contato
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Se você tiver perguntas sobre esta Política de Privacidade ou sobre nossas práticas 
              de privacidade, entre em contato conosco:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg space-y-2">
              <p className="text-slate-700 dark:text-slate-300">
                <strong>Email:</strong> privacidade@crmbroker.com
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                <strong>Endereço:</strong> [Seu endereço aqui]
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                <strong>Telefone:</strong> [Seu telefone aqui]
              </p>
            </div>
          </section>

          {/* Conformidade */}
          <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Conformidade com Regulamentações
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              Esta Política de Privacidade está em conformidade com a Lei Geral de Proteção de Dados (LGPD) 
              do Brasil e outras regulamentações aplicáveis de proteção de dados.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t mt-12 py-8 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            © 2026 CRM Broker. Todos os direitos reservados.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm">
              Início
            </Link>
            <Link href="/politicas-uso" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm">
              Políticas de Uso
            </Link>
            <Link href="/contato" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm">
              Contato
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
