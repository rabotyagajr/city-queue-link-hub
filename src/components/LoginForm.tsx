import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

const formSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

type FormValues = z.infer<typeof formSchema>

const LoginForm: React.FC = () => {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
      const success = await login(values.email, values.password)
      if (success) {
        toast({
          title: 'Успешный вход',
          description: 'Добро пожаловать в систему!',
        })
      } else {
        toast({
          title: 'Ошибка входа',
          description: 'Проверьте правильность email и пароля',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Произошла ошибка',
        description: 'Не удалось войти в систему',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@mail.ru" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Вход...
              </>
            ) : (
              'Войти'
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  )
}

export default LoginForm
