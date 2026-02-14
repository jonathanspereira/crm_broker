'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PolíticasUsoPage() {
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
            Políticas de Uso
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
              1. Termos e Condições de Uso
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Bem-vindo à plataforma CRM Broker. Ao acessar e usar esta plataforma, você concorda em cumprir 
              estes Termos e Condições de Uso. Se você não concordar com qualquer parte, não use este serviço.
            </p>
          </section>

          {/* Descrição do Serviço */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              2. Descrição do Serviço
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              O CRM Broker é uma plataforma de gerenciamento de relacionamento com clientes (CRM) 
              projetada especificamente para profissionais do setor imobiliário. Oferecemos ferramentas para:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mt-4 space-y-2">
              <li>Gestão de leads e clientes</li>
              <li>Simulação de financiamentos e cálculos imobiliários</li>
              <li>Criação e gerenciamento de documentos</li>
              <li>Gestão de inventário de propriedades</li>
              <li>Análise de dados e relatórios</li>
            </ul>
          </section>

          {/* Elegibilidade */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              3. Elegibilidade para Uso
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Para usar nossa plataforma, você deve:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
              <li>Ter pelo menos 18 anos de idade</li>
              <li>Possuir autoridade legal para contratar</li>
              <li>Não estar proibido em lei de utilizar os serviços</li>
              <li>Fornecer informações cadastrais precisas e completas</li>
              <li>Manter suas informações de acesso confidenciais</li>
            </ul>
          </section>

          {/* Conta de Usuário */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              4. Conta de Usuário
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Responsabilidade pela Conta
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Você é responsável por manter a confidencialidade de sua senha e de manter a confidencialidade 
                  de sua conta. Você concorda em aceitar responsabilidade por todas as atividades que ocorrem 
                  sob sua conta.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Informações Precisas
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Você concorda de fornecer informações precisas, atuais e completas. Você concorda em atualizar 
                  suas informações para manter sua precisão.
                </p>
              </div>
            </div>
          </section>

          {/* Proibições */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              5. Proibições
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Você concorda em NÃO utilizar a plataforma para:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
              <li>Atividades ilegais ou não autorizadas</li>
              <li>Violação de direitos de propriedade intelectual</li>
              <li>Acesso não autorizado a sistemas ou dados</li>
              <li>Transmissão de vírus, malware ou código nocivo</li>
              <li>Spam, phishing ou fraude</li>
              <li>Assédio ou abuso de outros usuários</li>
              <li>Reverse-engineering da plataforma</li>
              <li>Uso de bots ou scraping automatizado</li>
              <li>Compartilhamento de credenciais com terceiros</li>
              <li>Qualquer atividade que comprometa a segurança</li>
            </ul>
          </section>

          {/* Propriedade Intelectual */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              6. Propriedade Intelectual
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Todo o conteúdo, funcionalidade, design, logotipo e elementos da plataforma são propriedade 
              do CRM Broker, protegidos por direitos autorais e outras leis de propriedade intelectual.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Você recebe uma licença limitada, não exclusiva e pessoal para usar a plataforma apenas para 
              fins comerciais legítimos. Você não pode reproar, modificar, distribuir ou comercializar 
              qualquer conteúdo sem autorização.
            </p>
          </section>

          {/* Conteúdo do Usuário */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              7. Conteúdo do Usuário
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Você é responsável por todo conteúdo que você ou qualquer pessoa com acesso à sua conta 
              carrega, cria ou compartilha na plataforma.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Você garante que possui todos os direitos necessários sobre o conteúdo e que ele não viola 
              direitos de terceiros. Você concede ao CRM Broker direito de usar seu conteúdo para melhorar 
              nossos serviços.
            </p>
          </section>

          {/* Limitação de Responsabilidade */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              8. Limitação de Responsabilidade
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              NA MÁXIMA EXTENSÃO PERMITIDA POR LEI:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
              <li>
                A plataforma é fornecida "como está" sem garantias de qualquer tipo
              </li>
              <li>
                Não somos responsáveis por danos indiretos, incidentais ou consequentes
              </li>
              <li>
                Não somos responsáveis por perda de dados ou lucros cessantes
              </li>
              <li>
                Nossa responsabilidade total não excede o valor pago por você nos últimos 12 meses
              </li>
              <li>
                Você usa a plataforma por sua conta e risco
              </li>
            </ul>
          </section>

          {/* Isenção de Garantias */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              9. Isenção de Garantias
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              A plataforma é fornecida sem qualquer garantia explícita ou implícita, incluindo mas não 
              limitado a garantias de comercialização, adequação para um propósito particular ou 
              não infração. Não garantimos que a plataforma funcionará sem interrupções ou estará livre de erros.
            </p>
          </section>

          {/* Cancelamento e Cessação */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              10. Cancelamento e Cessação
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Você pode cancelar sua conta a qualquer momento entrando em contato com nosso suporte.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Nós podemos cessar ou suspender sua conta imediatamente, sem aviso prévio, se você violar 
              estes termos. Após cancelamento, você perderá acesso à sua conta e aos dados associados.
            </p>
          </section>

          {/* Modificação dos Termos */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              11. Modificação dos Termos
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Podemos modificar estes termos a qualquer momento. Notificaremos você de mudanças significativas 
              por email ou aviso na plataforma. Seu uso contínuo após as mudanças constitui aceitação.
            </p>
          </section>

          {/* Indenização */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              12. Indenização
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Você concorda em indenizar e manter indemne o CRM Broker contra qualquer reivindicação, 
              dano ou custo (incluindo honorários advocatícios) resultantes da sua violação destes termos 
              ou uso indevido da plataforma.
            </p>
          </section>

          {/* Disponibilidade */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              13. Disponibilidade do Serviço
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Nos esforçamos para manter a plataforma disponível 24/7, mas não garantimos tempo de atividade 
              contínuo. Podemos realizar manutenção programada, que pode resultar em indisponibilidade 
              temporária.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Não somos responsáveis por qualquer indisponibilidade causada por fatores fora de nosso controle, 
              incluindo problemas de internet ou de terceiros.
            </p>
          </section>

          {/* Lei Aplicável */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              14. Lei Aplicável
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Estes termos são regidos pelas leis do Brasil. Qualquer disputa será resolvida nos tribunais 
              competentes da jurisdição brasileira aplicável.
            </p>
          </section>

          {/* Contato */}
          <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Perguntas sobre estes Termos?
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm mb-3">
              Se você tiver dúvidas sobre estas Políticas de Uso, entre em contato conosco:
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              Email: <Link href="mailto:termos@crmbroker.com" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">termos@crmbroker.com</Link>
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
            <Link href="/privacidade" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm">
              Política de Privacidade
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
