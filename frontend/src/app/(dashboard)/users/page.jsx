"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useGetUsersQuery, useDeleteUserMutation } from "@/api/userApi";
import { useGetRolesQuery, useDeleteRoleMutation } from "@/api/roleApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  User,
  Shield,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { format } from "date-fns";

export default function UsersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { isLoggedIn, isLoading: authLoading } = useAuth();

  // Determine initial tab from URL, fallback to "users"
  const urlTab = searchParams.get("tab");
  const validTabs = ["users", "roles"];
  const initialTab = urlTab && validTabs.includes(urlTab) ? urlTab : "users";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState("");

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null,
    item: null,
  });

  // Users data
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    refetch: refetchUsers,
  } = useGetUsersQuery(undefined, { skip: !isLoggedIn });

  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const users = usersData?.users || [];

  // Roles data
  const {
    data: rolesData,
    isLoading: rolesLoading,
    isError: rolesError,
    refetch: refetchRoles,
  } = useGetRolesQuery(undefined, { skip: !isLoggedIn });

  const [deleteRole, { isLoading: isDeletingRole }] = useDeleteRoleMutation();
  const roles = rolesData?.roles || [];

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      toast.error("You must be logged in to access this page");
      router.replace("/login?redirect=/users");
    }
  }, [isLoggedIn, authLoading, router]);

  // Update URL when tab changes (shallow routing)
  const handleTabChange = (value) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  const isLoading = usersLoading || rolesLoading;
  const hasError =
    (activeTab === "users" && usersError) ||
    (activeTab === "roles" && rolesError);

  // Safe filtering (handles role being object)
  const filteredUsers = users.filter((u) =>
    [u.name || u.username || "", u.email || "", u.role?.name || ""].some(
      (field) => field.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const filteredRoles = roles.filter((r) =>
    [r.name || "", r.description || ""].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const handleDeleteUser = async () => {
    if (!deleteModal.item?._id) return;
    try {
      await deleteUser(deleteModal.item._id).unwrap();
      toast.success("User deleted successfully");
      refetchUsers();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user");
    } finally {
      setDeleteModal({ isOpen: false, type: null, item: null });
    }
  };

  const handleDeleteRole = async () => {
    if (!deleteModal.item?._id) return;
    try {
      await deleteRole(deleteModal.item._id).unwrap();
      toast.success("Role deleted successfully");
      refetchRoles();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete role");
    } finally {
      setDeleteModal({ isOpen: false, type: null, item: null });
    }
  };

  const openDeleteModal = (type, item) => {
    setDeleteModal({ isOpen: true, type, item });
  };

  const getRoleBadge = (roleName) => {
    if (!roleName || typeof roleName !== "string") {
      return "bg-zinc-500/15 text-zinc-500 border-zinc-500/20";
    }
    const normalized = roleName.toLowerCase().trim();
    const variants = {
      admin: "bg-red-500/15 text-red-500 border-red-500/20",
      editor: "bg-blue-500/15 text-blue-500 border-blue-500/20",
      user: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
    };
    return (
      variants[normalized] || "bg-zinc-500/15 text-zinc-500 border-zinc-500/20"
    );
  };

  const getStatusBadge = (status) => {
    if (!status || typeof status !== "string") {
      return "bg-green-500/15 text-green-500 border-green-500/20";
    }
    const normalized = status.toLowerCase().trim();
    return normalized === "active" || normalized === "true"
      ? "bg-green-500/15 text-green-500 border-green-500/20"
      : "bg-zinc-500/15 text-zinc-500 border-zinc-500/20";
  };

  return (
    <div className="space-y-6 md:space-y-8" data-testid="users-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
            Users & Roles
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage user accounts and permission roles
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="users">
            <User className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="w-4 h-4 mr-2" />
            Roles & Permissions
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage all user accounts
                  </CardDescription>
                </div>
                <Button onClick={() => router.push("/users/add")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : hasError ? (
                <div className="text-center py-12 text-destructive">
                  Failed to load users.
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refetchUsers}
                    className="ml-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-10 text-muted-foreground"
                          >
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage
                                    src={user.photo}
                                    alt={user.name || user.username}
                                  />
                                  <AvatarFallback>
                                    {(user.name ||
                                      user.username ||
                                      "?")[0]?.toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {user.name ||
                                      user.username ||
                                      "Unnamed User"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {user.username ? `@${user.username}` : ""}
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="font-mono text-sm">
                              {user.email}
                            </TableCell>

                            <TableCell>
                              <Badge className={getRoleBadge(user.role?.name)}>
                                {user.role?.name || "user"}
                              </Badge>
                            </TableCell>

                            <TableCell>
                              <Badge
                                className={getStatusBadge(
                                  user.isActive ? "active" : "inactive",
                                )}
                              >
                                {user.isActive !== undefined
                                  ? user.isActive
                                    ? "Active"
                                    : "Inactive"
                                  : "—"}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-sm text-muted-foreground">
                              {user.createdAt
                                ? format(
                                    new Date(user.createdAt),
                                    "MMM dd, yyyy",
                                  )
                                : "—"}
                            </TableCell>

                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  router.push(`/users/${user._id}/edit`)
                                }
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => openDeleteModal("user", user)}
                                disabled={isDeletingUser}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card className="border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Role Management</CardTitle>
                  <CardDescription>
                    Define roles and assign permissions
                  </CardDescription>
                </div>
                <Button onClick={() => router.push("/roles/add")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Role
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : hasError ? (
                <div className="text-center py-12 text-destructive">
                  Failed to load roles.
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refetchRoles}
                    className="ml-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRoles.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-10 text-muted-foreground"
                          >
                            No roles found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRoles.map((role) => (
                          <TableRow key={role._id}>
                            <TableCell>
                              <div className="font-semibold">{role.name}</div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {role.description || "—"}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {role.permissions?.slice(0, 4)?.map((p) => (
                                  <Badge
                                    key={p}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {p}
                                  </Badge>
                                ))}
                                {role.permissions?.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{role.permissions.length - 4}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{role.userCount ?? "?"}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  router.push(`/roles/${role._id}/edit`)
                                }
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => openDeleteModal("role", role)}
                                disabled={isDeletingRole}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, type: null, item: null })
        }
        onConfirm={
          deleteModal.type === "user" ? handleDeleteUser : handleDeleteRole
        }
        title={`Delete ${deleteModal.type === "user" ? "User" : "Role"}`}
        description={
          deleteModal.type === "user"
            ? `Are you sure you want to delete "${deleteModal.item?.name || deleteModal.item?.email}"? This action cannot be undone.`
            : `Are you sure you want to delete role "${deleteModal.item?.name}"? Users assigned to this role will need reassignment.`
        }
        itemName={deleteModal.item?.name || deleteModal.item?.email || ""}
      />
    </div>
  );
}
