import React, { useEffect, useState } from "react";
import authService from "../services/authService";
import studentService from "../services/studentService";
import mentorService from "../services/mentorService";
import DashboardLayout from "../components/layout/DashboardLayout";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getRoman = (num) => {
    const roman = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII" };
    return roman[num] || num;
  };

  const getFullDept = (dept) => {
    if (!dept) return "";
    const depts = {
      'CSE': 'COMPUTER SCIENCE AND ENGINEERING',
      'MECH': 'MECHANICAL ENGINEERING',
      'CIVIL': 'CIVIL ENGINEERING',
      'ECE': 'ELECTRONICS AND COMMUNICATION ENGINEERING',
      'IT': 'INFORMATION TECHNOLOGY'
    };
    return depts[dept.toUpperCase()] || dept;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        if (currentUser?.id) {
          if (currentUser.role === 'student') {
            const perfData = await studentService.getPerformance(currentUser.id);
            setData(perfData);
          } else if (currentUser.role === 'mentor') {
            const mData = await mentorService.getMentor(currentUser.id);
            setMentorData(mData);
          }
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black uppercase tracking-widest">Initialising Portal...</div>;

  return (
    <DashboardLayout title="Universal Profile Matrix">
      <div className="max-w-[1400px] mx-auto space-y-12 pb-20">
        
        {/* Profile Identity section */}
        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {/* Left: Icon Section */}
            <div className="bg-slate-50 flex items-center justify-center p-12 border-r border-slate-100">
               <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-6xl font-black text-white shadow-2xl border-8 border-white">
                  {(data?.student?.[0] || user?.name?.[0] || user?.role?.[0])}
               </div>
            </div>

            {/* Middle: Details section */}
            <div className="md:col-span-3 p-12 bg-white">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-4 py-1.5 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                      CONTINUING
                    </span>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                       Academic Status Check: Pass
                    </span>
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tight uppercase mb-1">
                    {data?.student || mentorData?.name || user?.name || user?.role}
                  </h2>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-10 border-b border-slate-100 pb-6">
                     {user?.role === 'student' 
                        ? `roll no: ${data?.roll_no || user?.roll_no || 'N/A'}` 
                        : user?.role === 'mentor' 
                          ? `faculty id: ${mentorData?.faculty_id || user?.faculty_id || 'N/A'}`
                          : `Portal ID: ${user?.id}`}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
                     {user?.role === 'student' ? (
                       <>
                         <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Current Standing</p>
                           <p className="text-xl font-black text-slate-900 uppercase">SEMESTER - {getRoman(data?.semester_id) || 'V'}</p>
                         </div>
                         <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Academic Program</p>
                           <p className="text-xl font-black text-slate-900 uppercase">B.E. - {getFullDept(data?.department || user?.department || 'CSE')}</p>
                         </div>
                         <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Assigned Academic Mentor</p>
                           <p className="text-xl font-black text-indigo-600 uppercase underline decoration-indigo-200">{data?.mentor_name || 'Dr Alan Turing'}</p>
                         </div>
                         <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Verified Score (CGPA)</p>
                           <p className="text-xl font-black text-slate-900">{data?.cgpa || '0.00'} / 10.00</p>
                         </div>
                       </>
                     ) : (
                       <>
                         <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                             {user?.role === 'mentor' ? 'Academic Rank' : 'Official Role'}
                           </p>
                           <p className="text-xl font-black text-slate-900 uppercase">
                             {user?.role === 'mentor' ? 'Senior Faculty' : `${user?.role} ADMINISTRATOR`}
                           </p>
                         </div>
                         <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Assigned Department</p>
                           <p className="text-xl font-black text-indigo-600 uppercase">
                             {getFullDept(mentorData?.department || user?.department) || 'Institutional Admin'}
                           </p>
                         </div>
                       </>
                     )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Profile;
