import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { AnimatedElement } from '@/components/ui/animated-element';
import { useFormTracking } from '@/components/AnalyticsProvider';

interface FormData {
  fullName: string;
  phone: string;
  projectDescription: string;
  honeypot: string; // Campo honeypot para detectar bots
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  projectDescription?: string;
  general?: string;
}

export const BudgetForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    projectDescription: '',
    honeypot: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [submissionCount, setSubmissionCount] = useState(0);
  
  const formRef = useRef<HTMLFormElement>(null);
  
  // Analytics para formulário
  const {
    trackFormStart,
    trackFormField,
    trackFormValidation,
    trackFormSubmission,
    trackFormAbandonment,
  } = useFormTracking('budget_form');

  // Máscara para telefone brasileiro
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  // Validação do lado do cliente
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validação do nome completo
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
      trackFormValidation('fullName', false);
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Nome deve ter pelo menos 2 caracteres';
      trackFormValidation('fullName', false);
    } else if (formData.fullName.trim().length > 100) {
      newErrors.fullName = 'Nome deve ter no máximo 100 caracteres';
      trackFormValidation('fullName', false);
    } else {
      trackFormValidation('fullName', true);
    }

    // Validação do telefone
    const phoneNumbers = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
      trackFormValidation('phone', false);
    } else if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      newErrors.phone = 'Telefone deve ter 10 ou 11 dígitos';
      trackFormValidation('phone', false);
    } else {
      trackFormValidation('phone', true);
    }

    // Validação da descrição do projeto
    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Descrição do projeto é obrigatória';
      trackFormValidation('projectDescription', false);
    } else if (formData.projectDescription.trim().length < 10) {
      newErrors.projectDescription = 'Descrição deve ter pelo menos 10 caracteres';
      trackFormValidation('projectDescription', false);
    } else if (formData.projectDescription.trim().length > 1000) {
      newErrors.projectDescription = 'Descrição deve ter no máximo 1000 caracteres';
      trackFormValidation('projectDescription', false);
    } else {
      trackFormValidation('projectDescription', true);
    }

    // Verificação do honeypot (se preenchido, é bot)
    if (formData.honeypot) {
      newErrors.general = 'Submissão suspeita detectada';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Rastrear início do formulário na primeira interação
    if (Object.values(formData).every(v => !v.trim()) && value.trim()) {
      trackFormStart();
    }

    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }
    
    if (field === 'projectDescription') {
      setCharacterCount(value.length);
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Rastrear mudança no campo
    if (field !== 'honeypot') {
      trackFormField(field, 'change');
    }
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (field !== 'honeypot' && errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Verificar limite de submissões (lado cliente - básico)
    if (submissionCount >= 3) {
      setErrors({ general: 'Limite de submissões atingido. Tente novamente mais tarde.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrors({});

    try {
      const response = await fetch('/api/budget-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formData.phone,
          projectDescription: formData.projectDescription.trim(),
          honeypot: formData.honeypot
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Orçamento enviado com sucesso! Entraremos em contato em breve.');
        setSubmissionCount(prev => prev + 1);
        
        // Rastrear submissão bem-sucedida
        trackFormSubmission(true);
        
        // Resetar formulário
        setFormData({
          fullName: '',
          phone: '',
          projectDescription: '',
          honeypot: ''
        });
        setCharacterCount(0);
        
        // Esconder mensagem de sucesso após 5 segundos
        setTimeout(() => {
          setSubmitStatus('idle');
          setSubmitMessage('');
        }, 5000);
        
      } else {
        setSubmitStatus('error');
        if (result.errors) {
          setErrors(result.errors);
          trackFormSubmission(false, 'Validation errors');
        } else {
          const errorMessage = result.message || 'Erro ao enviar orçamento. Tente novamente.';
          setSubmitMessage(errorMessage);
          trackFormSubmission(false, errorMessage);
        }
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setSubmitStatus('error');
      const errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      setSubmitMessage(errorMessage);
      trackFormSubmission(false, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedElement animation="fade-in" duration={800} delay={200}>
      <Card className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Solicitar Orçamento
          </CardTitle>
          <CardDescription className="text-gray-600">
            Preencha o formulário abaixo e entraremos em contato com uma proposta personalizada
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Honeypot (oculto) */}
            <input
              type="text"
              name="website"
              value={formData.honeypot}
              onChange={(e) => handleInputChange('honeypot', e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Nome Completo */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Nome Completo *
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                onFocus={() => trackFormField('fullName', 'focus')}
                onBlur={() => trackFormField('fullName', 'blur')}
                placeholder="Digite seu nome completo"
                className={`transition-all duration-200 ${
                  errors.fullName
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'focus:border-blue-500 focus:ring-blue-500'
                }`}
                maxLength={100}
              />
              {errors.fullName && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Telefone *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onFocus={() => trackFormField('phone', 'focus')}
                onBlur={() => trackFormField('phone', 'blur')}
                placeholder="(00) 00000-0000"
                className={`transition-all duration-200 ${
                  errors.phone
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'focus:border-blue-500 focus:ring-blue-500'
                }`}
                maxLength={15}
              />
              {errors.phone && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </div>
              )}
            </div>

            {/* Descrição do Projeto */}
            <div className="space-y-2">
              <Label htmlFor="projectDescription" className="text-sm font-medium text-gray-700">
                Descrição do Projeto *
              </Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                onFocus={() => trackFormField('projectDescription', 'focus')}
                onBlur={() => trackFormField('projectDescription', 'blur')}
                placeholder="Descreva detalhadamente seu projeto de impressão 3D..."
                className={`min-h-[120px] transition-all duration-200 resize-none ${
                  errors.projectDescription
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'focus:border-blue-500 focus:ring-blue-500'
                }`}
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                {errors.projectDescription && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.projectDescription}
                  </div>
                )}
                <div className={`text-sm ml-auto ${
                  characterCount > 1000 ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {characterCount}/1000
                </div>
              </div>
            </div>

            {/* Mensagens de Status */}
            {submitStatus === 'success' && (
              <Alert className="border-green-200 bg-green-50 animate-in fade-in duration-300">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {submitMessage}
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === 'error' && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {submitMessage}
                </AlertDescription>
              </Alert>
            )}

            {errors.general && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {errors.general}
                </AlertDescription>
              </Alert>
            )}

            {/* Botão de Envio */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Solicitar Orçamento
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};