import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { skillService } from '@/services/api/skillService';
import { Skill, CreateSkillRequest } from '@/models/skill';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Code, Plus, Pencil, Trash2, Award } from 'lucide-react';

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  yearsOfExperience: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
});

type SkillFormData = z.infer<typeof skillSchema>;

export default function UserSkills() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      level: 'beginner',
      yearsOfExperience: 0,
      description: '',
    },
  });

  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills', user?.id],
    queryFn: () => skillService.getByUserId(user!.id),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSkillRequest) => skillService.create(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast({ title: 'Skill added successfully' });
      setDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Failed to add skill', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      skillService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast({ title: 'Skill updated successfully' });
      setDialogOpen(false);
      setEditingSkill(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Failed to update skill', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => skillService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast({ title: 'Skill deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete skill', variant: 'destructive' });
    },
  });

  const handleOpenDialog = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      form.reset({
        name: skill.name,
        level: skill.level,
        yearsOfExperience: skill.yearsOfExperience || 0,
        description: skill.description || '',
      });
    } else {
      setEditingSkill(null);
      form.reset();
    }
    setDialogOpen(true);
  };

  const onSubmit = (data: SkillFormData) => {
    if (editingSkill) {
      updateMutation.mutate({ id: editingSkill.id, data });
    } else {
      createMutation.mutate(data as CreateSkillRequest);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      deleteMutation.mutate(id);
    }
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: 'secondary',
      intermediate: 'default',
      advanced: 'default',
      expert: 'default',
    };
    return colors[level] || 'secondary';
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading skills...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Skills</h1>
          <p className="text-muted-foreground">Showcase your expertise and abilities</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {!skills?.length ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No skills added yet</p>
            <Button onClick={() => handleOpenDialog()}>Add Your First Skill</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Card key={skill.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    <Badge variant={getLevelColor(skill.level) as any}>
                      {skill.level}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(skill)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(skill.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="mt-2">{skill.name}</CardTitle>
                {skill.yearsOfExperience !== undefined && (
                  <CardDescription>
                    {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} of experience
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {skill.description && (
                  <p className="text-sm text-muted-foreground">{skill.description}</p>
                )}
                {skill.endorsements !== undefined && skill.endorsements > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <Award className="w-4 h-4" />
                    {skill.endorsements} endorsements
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSkill ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
            <DialogDescription>
              {editingSkill
                ? 'Update your skill information'
                : 'Add a new skill to your profile'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="JavaScript, Python, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proficiency Level *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your experience with this skill..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingSkill ? 'Update' : 'Add'} Skill
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
