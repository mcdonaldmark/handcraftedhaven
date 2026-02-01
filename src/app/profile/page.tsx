"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "../components/avatar";


interface ProfileFormData {
    name: string;
    shopName: string;
    bio: string;
    password?: string;
    id: string;
}

export default function ProfilePage() {
    const { data: session, update, status } = useSession();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const [formData, setFormData] = useState<ProfileFormData>({
        name: "",
        shopName: "",
        bio: "",
        password: "",
        id: "",
    });

    useEffect(() => {
        if (session?.user) {
            setFormData({
                name: session.user.name || "",
                shopName: session.user.shopName || "",
                bio: session.user.bio || "",
                password: "",
                id: session.user.id,
            });
        }

        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (session?.user) {
            setFormData({
                name: session.user.name || "",
                shopName: session.user.shopName || "",
                bio: session.user.bio || "",
                password: "",
                id: session.user.id,
            });
        }
    }, [session, status, router]);

    const isArtisan = (session?.user as any)?.role === "artisan";

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await update({
                    ...session?.user,
                    name: formData.name,
                    shopName: formData.shopName,
                    bio: formData.bio
                });

                setIsEditing(false);
                //alert("Profile updated successfully!");
            }
            if (response.status === 401) {
                router.push("/login");
            }
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!session) return <div className="loading-state">Loading...</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>User Profile</h2>
                    {!isEditing && (
                        <button className="edit-trigger" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </button>
                    )}
                </div>
                <div className="avatar-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <UserAvatar name={session.user?.name} shopName={session.user?.shopName} role={session.user?.role} />
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    {/* Full Name - All users */}
                    <input type="hidden" name="id" value={session.user?.id} />
                    <div className="input-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>

                    {/* Artisan Specific Fields */}
                    {isArtisan && (
                        <>
                            <div className="input-group">
                                <label htmlFor="shopName">Shop Name</label>
                                <input
                                    id="shopName"
                                    name="shopName"
                                    type="text"
                                    value={formData.shopName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    rows={4}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Password - Only active when editing */}
                    {isEditing && (
                        <div className="input-group">
                            <label htmlFor="password">New Password (optional)</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current"
                            />
                        </div>
                    )}

                    {isEditing && (
                        <div className="form-buttons">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => setIsEditing(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="cta" disabled={loading}>
                                {loading ? "Saving..." : "Save Profile"}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}