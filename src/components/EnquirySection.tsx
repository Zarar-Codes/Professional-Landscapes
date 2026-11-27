import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { CheckCircle2, Copy, Mail, Phone, Upload, X } from 'lucide-react';
import { BRAND_INFO, ENQUIRY_PROJECT_TYPES } from '../data/landscapingData';

interface EnquirySectionProps {
  preselectedProjectType?: string;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  postcode: string;
  projectType: string;
  contactMethod: 'Phone' | 'Email' | 'Either';
  description: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  projectType?: string;
  description?: string;
}

export function EnquirySection({ preselectedProjectType }: EnquirySectionProps) {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    postcode: '',
    projectType: preselectedProjectType || ENQUIRY_PROJECT_TYPES[0],
    contactMethod: 'Either',
    description: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [photoFile, setPhotoFile] = useState<{ name: string; previewUrl: string } | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submittedSummary, setSubmittedSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (preselectedProjectType) {
      setForm((prev) => ({ ...prev, projectType: preselectedProjectType }));
    }
  }, [preselectedProjectType]);

  useEffect(() => {
    return () => {
      if (photoFile?.previewUrl) {
        URL.revokeObjectURL(photoFile.previewUrl);
      }
    };
  }, [photoFile]);

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      next.fullName = 'Please enter your full name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (!/^[0-9+\s()-]{7,20}$/.test(form.phone.trim())) {
      next.phone = 'Please enter a valid UK phone or mobile number.';
    }
    if (!/^[A-Za-z0-9\s]{3,10}$/.test(form.postcode.trim())) {
      next.postcode = 'Please enter your project postcode.';
    }
    if (!form.projectType) {
      next.projectType = 'Please choose a project type.';
    }
    if (!form.description.trim() || form.description.trim().length < 12) {
      next.description = 'Please include a brief summary of your garden project.';
    }
    return next;
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select an image file (JPG, PNG, or WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError('Please choose an image under 10 MB.');
      return;
    }
    if (photoFile?.previewUrl) {
      URL.revokeObjectURL(photoFile.previewUrl);
    }
    setPhotoFile({
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const summary = [
      `Name: ${form.fullName.trim()}`,
      `Email: ${form.email.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Postcode: ${form.postcode.trim().toUpperCase()}`,
      `Project Type: ${form.projectType}`,
      `Preferred Contact: ${form.contactMethod}`,
      photoFile ? `Attached Reference Photo: ${photoFile.name} (attach to email when sending)` : null,
      '',
      'Project Notes:',
      form.description.trim(),
    ]
      .filter(Boolean)
      .join('\n');

    setSubmittedSummary(summary);
    setCopied(false);
  };

  const handleCopySummary = async () => {
    if (!submittedSummary) return;
    try {
      await navigator.clipboard.writeText(submittedSummary);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const mailtoHref = submittedSummary
    ? `mailto:${BRAND_INFO.email}?subject=${encodeURIComponent(
        `Free Quotation Enquiry – ${form.projectType} (${form.postcode.trim().toUpperCase()})`
      )}&body=${encodeURIComponent(submittedSummary)}`
    : '#';

  return (
    <section
      id="quotation"
      className="py-20 sm:py-28 bg-white border-b border-[#294D4A]/12"
      aria-labelledby="enquiry-heading"
    >
      <div id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Direct Contact Options */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#579091] mb-3">
              Free Quotation &amp; Enquiries
            </p>
            <h2
              id="enquiry-heading"
              className="font-display text-[#172625] text-balance text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.12] tracking-tight mb-5"
            >
              Let&apos;s Bring Your Garden Ideas to Life.
            </h2>
            <p className="text-[#4B5B59] text-base sm:text-lg leading-relaxed mb-8">
              Planning a new patio, driveway, garden wall or complete outdoor improvement? Get in
              touch with our team to discuss your ideas and arrange a free quotation.
            </p>

            <div className="space-y-4 mb-8">
              <a
                href={BRAND_INFO.officePhoneHref}
                className="flex items-center justify-between p-5 bg-[#F7F6F2] border border-[#294D4A]/12 hover:border-[#579091] transition-colors group"
              >
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#579091]">
                    Call Our Office
                  </span>
                  <span className="font-display text-xl font-semibold text-[#172625] tabular-nums">
                    {BRAND_INFO.officePhone}
                  </span>
                </div>
                <Phone
                  className="w-5 h-5 text-[#294D4A] group-hover:text-[#579091] transition-colors"
                  aria-hidden="true"
                />
              </a>

              <a
                href={BRAND_INFO.mattMobileHref}
                className="flex items-center justify-between p-5 bg-[#F7F6F2] border border-[#294D4A]/12 hover:border-[#579091] transition-colors group"
              >
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#579091]">
                    Matt&apos;s Mobile
                  </span>
                  <span className="font-display text-xl font-semibold text-[#172625] tabular-nums">
                    {BRAND_INFO.mattMobile}
                  </span>
                </div>
                <Phone
                  className="w-5 h-5 text-[#294D4A] group-hover:text-[#579091] transition-colors"
                  aria-hidden="true"
                />
              </a>

              <a
                href={`mailto:${BRAND_INFO.email}`}
                className="flex items-center justify-between p-5 bg-[#F7F6F2] border border-[#294D4A]/12 hover:border-[#579091] transition-colors group"
              >
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#579091]">
                    Email Us Directly
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-[#172625] break-all">
                    {BRAND_INFO.email}
                  </span>
                </div>
                <Mail
                  className="w-5 h-5 text-[#294D4A] group-hover:text-[#579091] transition-colors shrink-0"
                  aria-hidden="true"
                />
              </a>
            </div>

            <div className="p-5 bg-[#EFECE5] text-sm text-[#4B5B59]">
              <p className="font-semibold text-[#172625] mb-1">Office Hours</p>
              <p className="tabular-nums">Open {BRAND_INFO.hours}</p>
            </div>
          </div>

          {/* Right Column: Structured Enquiry Form */}
          <div className="lg:col-span-7 bg-[#F7F6F2] border border-[#294D4A]/14 p-6 sm:p-9 lg:p-10">
            {submittedSummary ? (
              <div className="space-y-6" role="status" aria-live="polite">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-6 h-6 text-[#39A097] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-[#172625] mb-1">
                      Your Quotation Enquiry Is Ready to Send
                    </h3>
                    <p className="text-sm text-[#4B5B59] leading-relaxed">
                      Because this redesigned website does not yet have a server mail endpoint
                      configured, your details have not been transmitted automatically. Use the
                      button below to open your prepared enquiry straight in your email client for{' '}
                      <strong className="text-[#172625]">{BRAND_INFO.email}</strong>, or call our
                      office on{' '}
                      <strong className="text-[#172625] tabular-nums">
                        {BRAND_INFO.officePhone}
                      </strong>
                      .
                    </p>
                  </div>
                </div>

                <pre className="bg-white border border-[#294D4A]/14 p-4 text-xs sm:text-sm text-[#172625] whitespace-pre-wrap font-sans leading-relaxed">
                  {submittedSummary}
                </pre>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 text-sm font-semibold bg-[#579091] text-white hover:bg-[#294D4A] transition-colors"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    <span>Open in Email App</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 text-sm font-semibold border border-[#294D4A] text-[#294D4A] hover:bg-[#294D4A] hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    <span>{copied ? 'Copied Details' : 'Copy Enquiry Details'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubmittedSummary(null)}
                    className="inline-flex items-center justify-center min-h-[48px] px-4 py-3 text-sm font-medium text-[#4B5B59] hover:text-[#172625] cursor-pointer"
                  >
                    Edit Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="q-name"
                      className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#172625] mb-2"
                    >
                      Full Name <span className="text-[#579091]">*</span>
                    </label>
                    <input
                      id="q-name"
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Your full name"
                      className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#294D4A]/20 text-sm text-[#172625] focus:outline-none focus:border-[#579091]"
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 text-xs text-red-700 font-medium">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="q-email"
                      className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#172625] mb-2"
                    >
                      Email Address <span className="text-[#579091]">*</span>
                    </label>
                    <input
                      id="q-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.co.uk"
                      className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#294D4A]/20 text-sm text-[#172625] focus:outline-none focus:border-[#579091]"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-700 font-medium">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="q-phone"
                      className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#172625] mb-2"
                    >
                      Phone Number <span className="text-[#579091]">*</span>
                    </label>
                    <input
                      id="q-phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="01747 / 07..."
                      className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#294D4A]/20 text-sm text-[#172625] tabular-nums focus:outline-none focus:border-[#579091]"
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-red-700 font-medium">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="q-postcode"
                      className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#172625] mb-2"
                    >
                      Project Postcode <span className="text-[#579091]">*</span>
                    </label>
                    <input
                      id="q-postcode"
                      type="text"
                      required
                      value={form.postcode}
                      onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                      placeholder="e.g. SP7 8AA"
                      className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#294D4A]/20 text-sm text-[#172625] uppercase focus:outline-none focus:border-[#579091]"
                    />
                    {errors.postcode && (
                      <p className="mt-1.5 text-xs text-red-700 font-medium">{errors.postcode}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="q-type"
                      className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#172625] mb-2"
                    >
                      Type of Project <span className="text-[#579091]">*</span>
                    </label>
                    <select
                      id="q-type"
                      value={form.projectType}
                      onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                      className="w-full min-h-[46px] px-3.5 py-2.5 bg-white border border-[#294D4A]/20 text-sm text-[#172625] focus:outline-none focus:border-[#579091]"
                    >
                      {ENQUIRY_PROJECT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#172625] mb-2">
                      Preferred Contact Method
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Phone', 'Email', 'Either'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setForm({ ...form, contactMethod: method })}
                          className={`min-h-[46px] text-xs font-semibold border transition-colors cursor-pointer ${
                            form.contactMethod === method
                              ? 'bg-[#294D4A] text-white border-[#294D4A]'
                              : 'bg-white text-[#172625] border-[#294D4A]/20 hover:border-[#579091]'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="q-desc"
                    className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#172625] mb-2"
                  >
                    Short Project Description <span className="text-[#579091]">*</span>
                  </label>
                  <textarea
                    id="q-desc"
                    rows={4}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Tell us about your garden space, preferred materials (such as sandstone, porcelain, block paving, brickwork, or timberwork), and what you would like to achieve."
                    className="w-full px-3.5 py-3 bg-white border border-[#294D4A]/20 text-sm text-[#172625] focus:outline-none focus:border-[#579091]"
                  />
                  {errors.description && (
                    <p className="mt-1.5 text-xs text-red-700 font-medium">{errors.description}</p>
                  )}
                </div>

                {/* Optional Garden Photograph Upload */}
                <div>
                  <label
                    htmlFor="q-photo"
                    className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#172625] mb-2"
                  >
                    Garden Photograph (Optional)
                  </label>
                  {!photoFile ? (
                    <label
                      htmlFor="q-photo"
                      className="flex items-center justify-between gap-4 p-4 bg-white border border-dashed border-[#294D4A]/30 hover:border-[#579091] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Upload className="w-4 h-4 text-[#579091] shrink-0" aria-hidden="true" />
                        <span className="text-xs sm:text-sm text-[#4B5B59]">
                          Select a photo of your current garden or patio area
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#294D4A] shrink-0">Browse</span>
                      <input
                        id="q-photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="sr-only"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between gap-4 p-3 bg-white border border-[#294D4A]/20">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={photoFile.previewUrl}
                          alt="Selected garden preview"
                          className="w-12 h-12 object-cover shrink-0"
                        />
                        <span className="text-xs font-medium text-[#172625] truncate">
                          {photoFile.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPhotoFile(null)}
                        aria-label="Remove selected photograph"
                        className="p-2 text-[#4B5B59] hover:text-[#172625] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {photoError && (
                    <p className="mt-1.5 text-xs text-red-700 font-medium">{photoError}</p>
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center min-h-[50px] px-8 py-3.5 text-sm font-semibold tracking-wide bg-[#579091] text-white hover:bg-[#294D4A] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Request a Free Quotation
                  </button>
                  <a
                    href={BRAND_INFO.officePhoneHref}
                    className="inline-flex items-center justify-center min-h-[50px] px-6 py-3.5 text-sm font-semibold border border-[#294D4A]/30 text-[#172625] hover:border-[#294D4A] transition-colors whitespace-nowrap"
                  >
                    Call Our Office: {BRAND_INFO.officePhone}
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
