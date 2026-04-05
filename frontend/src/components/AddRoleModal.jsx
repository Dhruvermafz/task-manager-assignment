import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { availablePermissions } from '@/lib/mockUserData';

const AddRoleModal = ({ isOpen, onClose, onSave, editRole = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    if (editRole) {
      setFormData({
        name: editRole.name,
        description: editRole.description,
        permissions: editRole.permissions
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: []
      });
    }
  }, [editRole, isOpen]);

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="add-role-modal">
        <DialogHeader>
          <DialogTitle>{editRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
          <DialogDescription>
            {editRole ? 'Update role details and permissions' : 'Create a new role with custom permissions'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                placeholder="e.g., Admin, Editor, Viewer"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="role-name-input"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <Textarea
                id="role-description"
                placeholder="Brief description of this role"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                data-testid="role-description-input"
                rows={2}
                required
              />
            </div>
            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="border rounded-lg p-4 space-y-3 bg-card/50">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={() => handlePermissionToggle(permission.id)}
                      data-testid={`permission-${permission.id}`}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {permission.name}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" data-testid="save-role-button">
              {editRole ? 'Update Role' : 'Add Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleModal;
