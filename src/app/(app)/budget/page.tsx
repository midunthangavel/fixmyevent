
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { PageWrapper } from '@/components/shared/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Loader, PlusCircle, Trash2, Wallet, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { addExpensesToBudget } from '@/ai/flows/budget-assistant';
import type { AddExpensesToBudgetOutput } from '@/ai/flows/budget-assistant.types';
import { Textarea } from '@/components/ui/textarea';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig, ChartLabel } from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';

const expenseSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Item name is required'),
    category: z.string().min(1, 'Category is required'),
    amount: z.coerce.number().positive('Amount must be positive'),
});

const budgetSchema = z.object({
    totalBudget: z.coerce.number().positive('Total budget must be a positive number'),
    expenses: z.array(expenseSchema),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

const expenseCategories = ['Venue', 'Catering', 'Decorations', 'Entertainment', 'Transport', 'Photography', 'Attire', 'Other'];

const chartConfig = {
  Venue: {
    label: "Venue",
    color: "hsl(var(--chart-1))",
  },
  Catering: {
    label: "Catering",
    color: "hsl(var(--chart-2))",
  },
  Decorations: {
    label: "Decorations",
    color: "hsl(var(--chart-3))",
  },
  Entertainment: {
    label: "Entertainment",
    color: "hsl(var(--chart-4))",
  },
  Transport: {
    label: "Transport",
    color: "hsl(var(--chart-5))",
  },
  Photography: {
    label: "Photography",
    color: "hsl(var(--chart-1))",
  },
  Attire: {
    label: "Attire",
    color: "hsl(var(--chart-2))",
  },
  Other: {
    label: "Other",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig

export default function BudgetPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');

    const form = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            totalBudget: 10000,
            expenses: [],
        },
    });
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'expenses',
    });

    const totalBudget = form.watch('totalBudget');
    const expenses = form.watch('expenses');
    const totalSpent = useMemo(() => expenses.reduce((acc, expense) => acc + expense.amount, 0), [expenses]);
    const remaining = totalBudget - totalSpent;
    const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    const chartData = useMemo(() => {
        if (expenses.length === 0) return [];
        const categoryTotals = expenses.reduce((acc, expense) => {
            if (expense.category && expense.amount) {
                const category = expense.category;
                if (!acc[category]) {
                    acc[category] = 0;
                }
                acc[category] += expense.amount;
            }
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categoryTotals).map(([category, amount]) => ({
            category,
            amount,
            fill: chartConfig[category as keyof typeof chartConfig]?.color || chartConfig.Other.color,
        }));
    }, [expenses]);


    useEffect(() => {
        if (!user) return;
        const budgetDocRef = doc(db, 'budgets', user.uid);
        const unsubscribe = onSnapshot(budgetDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data() as BudgetFormValues;
                form.reset(data);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user, form]);

    const handleAiAdd = async () => {
        if (!aiPrompt) return;
        setAiLoading(true);
        try {
            const result: AddExpensesToBudgetOutput = await addExpensesToBudget({ prompt: aiPrompt });
            if (result.expenses && result.expenses.length > 0) {
                append(result.expenses);
                toast({
                    title: 'Expenses Added',
                    description: `Successfully added ${result.expenses.length} item(s) to your budget.`,
                });
                setAiPrompt('');
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'No Expenses Found',
                    description: 'The AI could not identify any expenses in your request. Please try rephrasing.',
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'AI Error',
                description: 'Failed to process your request with AI.',
            });
        } finally {
            setAiLoading(false);
        }
    };
    
    const onSubmit = async (data: BudgetFormValues) => {
        if (!user) return;
        try {
            await setDoc(doc(db, 'budgets', user.uid), {
                ...data,
                updatedAt: serverTimestamp(),
            });
            toast({
                title: 'Budget Saved',
                description: 'Your budget has been successfully updated.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to save budget.',
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="h-6 w-6 animate-spin" />
            </div>
        );
    }
    
    return (
        <PageWrapper
            icon={Wallet}
            title="Budget"
            description="Manage your event expenses and stay on top of your budget."
        >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Budget Overview</CardTitle>
                         <div className="flex items-center gap-4 pt-2">
                            <Label htmlFor="total-budget" className="whitespace-nowrap text-sm">Total Budget ($)</Label>
                            <Input
                                id="total-budget"
                                type="number"
                                className="max-w-xs h-9"
                                {...form.register('totalBudget')}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div>
                                <ChartContainer
                                    config={chartConfig}
                                    className="mx-auto aspect-square max-h-[250px]"
                                >
                                    <PieChart>
                                        <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Pie
                                            data={chartData}
                                            dataKey="amount"
                                            nameKey="category"
                                            innerRadius={60}
                                            strokeWidth={5}
                                            outerRadius={90}
                                        >
                                            {chartData.map((entry) => (
                                                <Cell key={entry.category} fill={entry.fill} />
                                            ))}
                                            <ChartLabel
                                                className="fill-foreground text-center"
                                                dy={-10}
                                            >
                                                Total
                                            </ChartLabel>
                                            <ChartLabel
                                                className="fill-foreground font-bold text-lg"
                                                dy={15}
                                            >
                                                ${totalSpent.toFixed(2)}
                                            </ChartLabel>
                                        </Pie>
                                    </PieChart>
                                </ChartContainer>
                            </div>
                            <div className='space-y-4'>
                                <Card>
                                    <CardHeader className='p-4'>
                                        <CardTitle className="text-base">Total Spent</CardTitle>
                                        <CardDescription>${totalSpent.toFixed(2)}</CardDescription>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className='p-4'>
                                        <CardTitle className="text-base">Remaining</CardTitle>
                                        <CardDescription 
                                            className={cn("text-base font-bold", remaining < 0 && "text-destructive")}
                                        >
                                            ${remaining.toFixed(2)}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </div>
                       </div>
                        <div className="mt-4">
                            <Progress value={spentPercentage} className="w-full h-2" />
                            <p className="text-xs text-muted-foreground mt-2 text-center">{spentPercentage.toFixed(0)}% of budget used</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>AI Expense Assistant</CardTitle>
                        <CardDescription>Quickly add expenses using natural language. Try &quot;Add $500 for catering and $200 for a DJ.&quot;</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                       <Textarea 
                         placeholder="e.g., Add $1500 for venue, $500 for flowers, and $300 for the cake"
                         value={aiPrompt}
                         onChange={(e) => setAiPrompt(e.target.value)}
                         disabled={aiLoading}
                       />
                       <Button type="button" onClick={handleAiAdd} disabled={aiLoading || !aiPrompt} size="sm">
                           {aiLoading ? <Loader className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                           Add with AI
                       </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Expenses</CardTitle>
                        <CardDescription>Add and manage your expense items manually.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="p-4 space-y-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <Input 
                                            placeholder="Expense Name"
                                            className="text-base font-semibold border-none shadow-none p-0 focus-visible:ring-0 h-auto"
                                            {...form.register(`expenses.${index}.name`)} 
                                        />
                                        <Button type="button" variant="ghost" size="icon" className='h-7 w-7' onClick={() => remove(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                     <Select
                                        onValueChange={(value) => form.setValue(`expenses.${index}.category`, value)}
                                        defaultValue={field.category}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {expenseCategories.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">$</span>
                                        <Input type="number" placeholder='0.00' {...form.register(`expenses.${index}.amount`)} />
                                    </div>
                                </Card>
                            ))}
                        </div>

                         <Button
                            type="button"
                            variant="outline"
                            className="mt-4"
                            size="sm"
                            onClick={() => append({ name: '', category: 'Other', amount: 0 })}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Expense Manually
                        </Button>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                       {form.formState.isSubmitting ? <Loader className="animate-spin mr-2" /> : null}
                       Save Budget
                    </Button>
                </div>
            </form>
        </PageWrapper>
    );
}
