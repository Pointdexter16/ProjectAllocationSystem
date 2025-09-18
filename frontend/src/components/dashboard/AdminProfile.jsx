import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import '../../styles/dashboard.css';
import { User, Mail, IdCard, Briefcase, Users, FolderOpen } from 'lucide-react';

const AdminProfile = () => {
  const { user } = useAuth();
  const managerId = user?.Staff_id;

  const [stats, setStats] = useState({
    teamCount: 0,
    projectCount: 0,
  });

  useEffect(() => {
    if (!managerId) return;

    const fetchStats = async () => {
      try {
        const [empRes, projRes] = await Promise.all([
          axios.get(`http://localhost:8000/admin/employee_count/${managerId}`),
          axios.get(`http://localhost:8000/admin/project/${managerId}`),
        ]);

        const teamCount = empRes.data?.employee_count ?? empRes.data?.employeeCount ?? empRes.data?.count ?? 0;
        const projectCount = Array.isArray(projRes.data?.projects) ? projRes.data.projects.length : 0;

        setStats({ teamCount, projectCount });
      } catch (e) {
        // Silently fail for profile page, keep UI responsive
        console.error('Profile stats fetch failed', e);
      }
    };

    fetchStats();
  }, [managerId]);

  return (
    <div className="admin-dashboard" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="page-title">My Profile</h1>
          <p className="page-description">Account details for the logged-in admin</p>
        </div>
      </div>

      <div className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <User size={18} />
                <div>
                  <div style={{ fontWeight: 600 }}>{user?.First_name} {user?.Last_name}</div>
                  <div style={{ color: 'var(--gray-600)', fontSize: 13 }}>Full name</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Mail size={18} />
                <div>
                  <div style={{ fontWeight: 600 }}>{user?.Email}</div>
                  <div style={{ color: 'var(--gray-600)', fontSize: 13 }}>Email</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Briefcase size={18} />
                <div>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {user?.Job_role}
                    <Badge variant="secondary">Admin</Badge>
                  </div>
                  <div style={{ color: 'var(--gray-600)', fontSize: 13 }}>Role</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <IdCard size={18} />
                <div>
                  <div style={{ fontWeight: 600 }}>{user?.Staff_id}</div>
                  <div style={{ color: 'var(--gray-600)', fontSize: 13 }}>Staff ID</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div style={{ display: 'grid', gap: 16 }}>
          <Card className="stat-card">
            <CardContent>
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">My Team</p>
                  <p className="stat-value">{stats.teamCount}</p>
                </div>
                <div className="stat-icon stat-icon-blue">
                  <Users style={{ width: 24, height: 24 }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent>
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">My Projects</p>
                  <p className="stat-value">{stats.projectCount}</p>
                </div>
                <div className="stat-icon stat-icon-green">
                  <FolderOpen style={{ width: 24, height: 24 }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
