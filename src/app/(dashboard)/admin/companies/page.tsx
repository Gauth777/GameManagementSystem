"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/animations/FadeIn";
import { useToast } from "@/hooks/useToast";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import type { Company } from "@/types";

export default function CompaniesPage() {
  const toast = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", headquarters: "", foundedYear: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchCompanies = async () => {
    const res = await fetch("/api/companies");
    if (res.ok) {
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : data.data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCompanies(); }, []);

  const openCreate = () => { setEditId(null); setForm({ name: "", headquarters: "", foundedYear: "" }); setShowModal(true); };
  const openEdit = (c: Company) => { setEditId(c.id); setForm({ name: c.name, headquarters: c.headquarters, foundedYear: String(c.foundedYear) }); setShowModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const body = { name: form.name, headquarters: form.headquarters, foundedYear: Number(form.foundedYear) };
    const url = editId ? `/api/companies/${editId}` : "/api/companies";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { toast.success(editId ? "Updated" : "Created"); setShowModal(false); fetchCompanies(); }
    else { const d = await res.json(); toast.error(d.error || "Failed"); }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    const res = await fetch(`/api/companies/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); fetchCompanies(); } else { toast.error("Failed"); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Companies" description="Manage game companies">
        <Button onClick={openCreate} size="sm"><Plus size={14} /> Add Company</Button>
      </PageHeader>
      <FadeIn>
        <Card hoverEffect={false}>
          <CardContent className="p-0">
            {loading ? <SkeletonTable rows={5} /> : (
              <Table>
                <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>HQ</TableHead><TableHead>Founded</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {companies.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-text-muted">#{c.id}</TableCell>
                      <TableCell className="font-medium"><span className="flex items-center gap-2"><Building2 size={14} className="text-primary" />{c.name}</span></TableCell>
                      <TableCell className="text-text-muted">{c.headquarters}</TableCell>
                      <TableCell className="text-text-muted">{c.foundedYear}</TableCell>
                      <TableCell className="text-right"><div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-md hover:bg-surface-2 text-text-muted hover:text-accent transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-md hover:bg-surface-2 text-text-muted hover:text-accent-2 transition-colors"><Trash2 size={14} /></button>
                      </div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </FadeIn>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? "Edit Company" : "Add Company"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" id="cn" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Headquarters" id="chq" value={form.headquarters} onChange={(e) => setForm({ ...form, headquarters: e.target.value })} required />
          <Input label="Founded Year" id="cfy" type="number" value={form.foundedYear} onChange={(e) => setForm({ ...form, foundedYear: e.target.value })} required />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" isLoading={submitting}>{editId ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
